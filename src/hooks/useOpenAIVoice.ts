import { useState, useRef } from "react";
import { supabase } from "../lib/supabase";

interface UseOpenAIVoiceReturn {
  isSpeaking: boolean;
  speak: (text: string, language: string) => Promise<void>;
  stopSpeaking: () => void;
}

export function useOpenAIVoice(): UseOpenAIVoiceReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const speak = async (text: string, language: string) => {
    try {
      // Stop any current speech
      stopSpeaking();

      setIsSpeaking(true);

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke(
        "text-to-speech",
        {
          body: { text, language },
        }
      );

      if (error) {
        console.error("TTS error:", error);
        throw error;
      }

      // Create audio from response
      const audioBlob = new Blob([data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error("Failed to speak:", error);
      setIsSpeaking(false);
      throw error;
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  return {
    isSpeaking,
    speak,
    stopSpeaking,
  };
}
