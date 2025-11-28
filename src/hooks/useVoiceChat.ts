import { useState, useEffect, useRef } from "react";

interface UseVoiceChatReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSupported: boolean;
  isVoiceMode: boolean;
  toggleVoiceMode: () => void;
  clearTranscript: () => void;
}

export function useVoiceChat(language: string = "it-IT"): UseVoiceChatReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const silenceTimerRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition && "speechSynthesis" in window) {
      setIsSupported(true);

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);

        if (finalTranscript.trim()) {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }, 2000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        // iOS requires explicit user interaction
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
        // If already started, stop and restart
        if (
          error instanceof Error &&
          error.message.includes("already started")
        ) {
          try {
            recognitionRef.current.stop();
            setTimeout(() => {
              if (recognitionRef.current) {
                recognitionRef.current.start();
              }
            }, 100);
          } catch (e) {
            console.error("Failed to restart recognition:", e);
          }
        }
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      // iOS requires voices to be loaded
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find((voice) =>
          voice.lang.startsWith(language.split("-")[0])
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      };

      if (speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        speechSynthesis.addEventListener("voiceschanged", loadVoices, {
          once: true,
        });
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
      };

      synthesisRef.current = utterance;

      // iOS Safari requires a small delay
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceMode = () => {
    const newMode = !isVoiceMode;
    setIsVoiceMode(newMode);

    if (!newMode) {
      stopListening();
      stopSpeaking();
      setTranscript("");
    } else if (newMode && !isListening && !isSpeaking) {
      // iOS requires user interaction to start, so we start immediately
      setTimeout(() => {
        startListening();
      }, 100);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported,
    isVoiceMode,
    toggleVoiceMode,
    clearTranscript,
  };
}
