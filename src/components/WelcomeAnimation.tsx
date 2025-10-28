import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import VillageAnimation from "./VillageAnimation";
import WelcomeTextAnimation from "./WelcomeTextAnimation";

interface WelcomeAnimationProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function WelcomeAnimation({
  onComplete,
  onSkip,
}: WelcomeAnimationProps) {
  const [phase, setPhase] = useState<"start" | "village" | "welcome">("start");
  const [voiceActive, setVoiceActive] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationStarted = useRef(false);

  const startAnimation = () => {
    if (animationStarted.current) return;
    animationStarted.current = true;

    setPhase("village");

    // Preload audio for better synchronization
    const audio = new Audio("/audio/welcome.mp3");
    audio.preload = "auto";
    audio.load();
    audioRef.current = audio;

    const villageTimer = setTimeout(() => {
      setPhase("welcome");
      // Start audio and text animation simultaneously
      setVoiceActive(true);
      playWelcomeMessage();
    }, 3000);

    // Extended timer to allow for 6-second audio + text animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 10000); // 3s (village) + 6s (audio) + 1s (buffer)

    return () => {
      clearTimeout(villageTimer);
      clearTimeout(completeTimer);
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  };

  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playWelcomeMessage = () => {
    if (isMuted) return;

    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/welcome.mp3");
      audioRef.current.preload = "auto";
    }

    const audio = audioRef.current;
    audio.currentTime = 0;

    // Ensure audio is ready before playing
    const playAudio = () => {
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
            setVoiceActive(true);
          })
          .catch((error) => {
            console.warn(
              "Audio playback failed, falling back to speech synthesis:",
              error
            );
            setAudioError(true);
            fallbackToSpeechSynthesis();
          });
      } else {
        setVoiceActive(true);
      }
    };

    if (audio.readyState >= 2) {
      // Audio is ready to play
      playAudio();
    } else {
      // Wait for audio to be ready
      audio.addEventListener("canplay", playAudio, { once: true });
      audio.load();
    }
  };

  const fallbackToSpeechSynthesis = () => {
    console.log("Using speech synthesis fallback");
    setVoiceActive(true);

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const italianVoice = voices.find((voice) => voice.lang.startsWith("it"));

      console.log("Available voices:", voices.length);
      console.log("Italian voice found:", !!italianVoice);

      const utterance = new SpeechSynthesisUtterance(
        "Benvenuto, sono la guida turistica di questo bellissimo borgo. Come posso aiutarti?"
      );
      utterance.lang = "it-IT";
      utterance.rate = 0.9;
      utterance.pitch = 1;

      if (italianVoice) {
        utterance.voice = italianVoice;
      }

      utterance.onstart = () => {
        console.log("Speech synthesis started");
      };

      utterance.onend = () => {
        console.log("Speech synthesis ended");
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    };

    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      speechSynthesis.addEventListener("voiceschanged", loadVoices, {
        once: true,
      });
    }
  };

  const handleSkip = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onSkip();
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (newMutedState) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      setVoiceActive(false);
    } else {
      if (phase === "welcome") {
        playWelcomeMessage();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-bg-primary z-50 flex items-center justify-center overflow-hidden font-breton">
      {phase === "start" && (
        <div
          onClick={startAnimation}
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-50 bg-bg-primary"
        >
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <img
                src="/icon_option_2.png"
                alt="Start"
                className="w-32 h-32 mx-auto"
              />
            </div>
            <h2 className="text-4xl font-breton font-semibold text-white mb-4">
              Tocca per iniziare
            </h2>
            <p className="text-white/80 text-lg font-breton">
              Click anywhere to start the experience
            </p>
          </div>
        </div>
      )}

      {phase !== "start" && (
        <div className="absolute top-6 right-6 flex gap-2 z-10">
          <button
            onClick={toggleMute}
            className="p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full shadow-lg transition-all hover:scale-110 border border-white/20"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            )}
          </button>
          <button
            onClick={handleSkip}
            className="p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full shadow-lg transition-all hover:scale-110 border border-white/20"
            aria-label="Skip animation"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      <div className="relative w-full h-full flex items-center justify-center bg-bg-primary">
        {phase === "village" && (
          <div className="animate-fade-in w-full h-full bg-bg-primary">
            <VillageAnimation />
          </div>
        )}

        {phase === "welcome" && (
          <div className="animate-fade-in w-full h-full bg-bg-primary relative">
            <WelcomeTextAnimation />
            {audioError && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
                <p className="text-sm text-accent-primary font-breton text-center bg-bg-primary/80 px-4 py-2 rounded-lg">
                  Using text-to-speech
                </p>
              </div>
            )}
            {isMuted && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
                <p className="text-sm text-white/70 font-breton text-center bg-bg-primary/80 px-4 py-2 rounded-lg">
                  Audio is muted
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInSmooth {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.2;
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-fade-in-smooth {
          animation: fadeInSmooth 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
