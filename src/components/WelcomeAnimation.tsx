import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface WelcomeAnimationProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function WelcomeAnimation({ onComplete, onSkip }: WelcomeAnimationProps) {
  const [phase, setPhase] = useState<'illustration' | 'greeting' | 'voice'>('illustration');
  const [showSkip, setShowSkip] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasUserInteracted = useRef(false);

  useEffect(() => {
    setShowSkip(true);

    // Preload audio
    const audio = new Audio('/audio/welcome.mp3');
    audio.preload = 'auto';
    audio.load();
    audioRef.current = audio;

    // Add user interaction listener
    const handleInteraction = () => {
      hasUserInteracted.current = true;
    };
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    const illustrationTimer = setTimeout(() => {
      setPhase('greeting');
    }, 3000);

    const greetingTimer = setTimeout(() => {
      setPhase('voice');
      setVoiceActive(true);
      playWelcomeMessage();
    }, 5500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 12000);

    return () => {
      clearTimeout(illustrationTimer);
      clearTimeout(greetingTimer);
      clearTimeout(completeTimer);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onComplete]);

  const playWelcomeMessage = () => {
    if (isMuted) return;

    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/welcome.mp3');
    }

    const audio = audioRef.current;
    audio.currentTime = 0;

    // Attempt to play
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Audio playback started successfully');
          setVoiceActive(true);
        })
        .catch((error) => {
          console.warn('Audio playback failed, falling back to speech synthesis:', error);
          setAudioError(true);
          fallbackToSpeechSynthesis();
        });
    } else {
      // Fallback if play() doesn't return a promise
      setVoiceActive(true);
    }
  };

  const fallbackToSpeechSynthesis = () => {
    console.log('Using speech synthesis fallback');
    setVoiceActive(true);

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const italianVoice = voices.find(voice => voice.lang.startsWith('it'));

      console.log('Available voices:', voices.length);
      console.log('Italian voice found:', !!italianVoice);

      const utterance = new SpeechSynthesisUtterance(
        "Benvenuto, sono la guida turistica di questo bellissimo borgo. Come posso aiutarti?"
      );
      utterance.lang = 'it-IT';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      if (italianVoice) {
        utterance.voice = italianVoice;
      }

      utterance.onstart = () => {
        console.log('Speech synthesis started');
      };

      utterance.onend = () => {
        console.log('Speech synthesis ended');
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    };

    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      speechSynthesis.addEventListener('voiceschanged', loadVoices, { once: true });
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
      // Muting - stop all audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      setVoiceActive(false);
    } else {
      // Unmuting - restart playback if in voice phase
      if (phase === 'voice') {
        playWelcomeMessage();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 z-50 flex items-center justify-center overflow-hidden">
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        <button
          onClick={toggleMute}
          className="p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full shadow-lg transition-all hover:scale-110 border border-white/20"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
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

      <div className="relative w-full h-full flex items-center justify-center">
        {phase === 'illustration' && (
          <div className="animate-fade-in">
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              className="drop-shadow-2xl"
            >
              <g className="animate-draw-in" style={{ animationDelay: '0.2s' }}>
                <rect
                  x="100"
                  y="220"
                  width="80"
                  height="120"
                  fill="#E8B17C"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 0.2s forwards' }}
                />
                <polygon
                  points="140,220 100,240 180,240"
                  fill="#C8866B"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 0.3s forwards' }}
                />
                <circle
                  cx="140"
                  cy="280"
                  r="20"
                  fill="#8B6F47"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 0.4s forwards' }}
                />
              </g>

              <g className="animate-draw-in" style={{ animationDelay: '0.6s' }}>
                <rect
                  x="120"
                  y="140"
                  width="60"
                  height="80"
                  fill="#D4A574"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 0.6s forwards' }}
                />
                <rect
                  x="135"
                  y="160"
                  width="12"
                  height="20"
                  fill="#8B6F47"
                  rx="6"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 0.7s forwards' }}
                />
                <rect
                  x="153"
                  y="160"
                  width="12"
                  height="20"
                  fill="#8B6F47"
                  rx="6"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 0.7s forwards' }}
                />
                <line
                  x1="150"
                  y1="140"
                  x2="150"
                  y2="100"
                  stroke="#8B6F47"
                  strokeWidth="4"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 0.8s forwards' }}
                />
                <line
                  x1="140"
                  y1="100"
                  x2="160"
                  y2="100"
                  stroke="#8B6F47"
                  strokeWidth="4"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 0.8s forwards' }}
                />
                <line
                  x1="150"
                  y1="100"
                  x2="150"
                  y2="80"
                  stroke="#8B6F47"
                  strokeWidth="3"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 0.9s forwards' }}
                />
                <circle
                  cx="150"
                  cy="75"
                  r="5"
                  fill="#8B6F47"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 1s forwards' }}
                />
              </g>

              <g className="animate-draw-in" style={{ animationDelay: '1.2s' }}>
                <polygon
                  points="240,200 220,240 260,240"
                  fill="#C85A54"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 1.2s forwards' }}
                />
                <rect
                  x="220"
                  y="240"
                  width="40"
                  height="60"
                  fill="#E8B17C"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 1.3s forwards' }}
                />
                <rect
                  x="230"
                  y="260"
                  width="8"
                  height="12"
                  fill="#8B6F47"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 1.4s forwards' }}
                />
              </g>

              <g className="animate-draw-in" style={{ animationDelay: '1.6s' }}>
                <polygon
                  points="300,260 280,300 300,300 320,300"
                  fill="#6B8E23"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 1.6s forwards' }}
                />
                <polygon
                  points="300,240 290,260 310,260"
                  fill="#556B2F"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 1.7s forwards' }}
                />
              </g>

              <g className="animate-draw-in" style={{ animationDelay: '2s' }}>
                <polygon
                  points="70,280 60,300 80,300"
                  fill="#6B8E23"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 2s forwards' }}
                />
                <polygon
                  points="70,270 65,280 75,280"
                  fill="#556B2F"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 2.1s forwards' }}
                />
              </g>

              <g className="animate-draw-in" style={{ animationDelay: '2.3s' }}>
                <circle
                  cx="320"
                  cy="100"
                  r="35"
                  fill="#FDB813"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 2.3s forwards' }}
                />
                <circle
                  cx="320"
                  cy="100"
                  r="30"
                  fill="#FFA500"
                  className="opacity-0"
                  style={{ animation: 'fadeIn 0.8s ease-out 2.4s forwards' }}
                />
              </g>
            </svg>
          </div>
        )}

        {phase === 'greeting' && (
          <div className="animate-fade-in text-center">
            <h1
              className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-orange-500"
              style={{
                animation: 'scaleIn 1s ease-out forwards',
              }}
            >
              CIAO
            </h1>
          </div>
        )}

        {phase === 'voice' && (
          <div className="animate-fade-in text-center">
            <div className="relative mb-8">
              <div className="relative inline-flex items-center justify-center">
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-xl transition-all duration-700 ${
                    voiceActive ? 'scale-150 opacity-30' : 'scale-100 opacity-20'
                  }`}
                  style={{
                    animation: voiceActive ? 'pulse 2s ease-in-out infinite' : 'none',
                  }}
                ></div>

                <div
                  className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-2xl flex items-center justify-center transition-all duration-500 ${
                    voiceActive ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <div className="flex gap-2 items-end">
                    <div
                      className="w-2 bg-white rounded-full"
                      style={{
                        height: '40px',
                        animation: voiceActive ? 'wave 0.8s ease-in-out infinite' : 'none',
                        animationDelay: '0s',
                      }}
                    ></div>
                    <div
                      className="w-2 bg-white rounded-full"
                      style={{
                        height: '24px',
                        animation: voiceActive ? 'wave 0.8s ease-in-out infinite' : 'none',
                        animationDelay: '0.1s',
                      }}
                    ></div>
                    <div
                      className="w-2 bg-white rounded-full"
                      style={{
                        height: '50px',
                        animation: voiceActive ? 'wave 0.8s ease-in-out infinite' : 'none',
                        animationDelay: '0.2s',
                      }}
                    ></div>
                    <div
                      className="w-2 bg-white rounded-full"
                      style={{
                        height: '32px',
                        animation: voiceActive ? 'wave 0.8s ease-in-out infinite' : 'none',
                        animationDelay: '0.3s',
                      }}
                    ></div>
                    <div
                      className="w-2 bg-white rounded-full"
                      style={{
                        height: '44px',
                        animation: voiceActive ? 'wave 0.8s ease-in-out infinite' : 'none',
                        animationDelay: '0.4s',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-2xl text-white font-medium max-w-3xl mx-auto px-8 leading-relaxed text-center">
              Benvenuto, sono la guida turistica di questo bellissimo borgo. Come posso aiutarti?
            </p>
            {audioError && (
              <p className="text-sm text-amber-300 mt-4">Using text-to-speech</p>
            )}
            {isMuted && (
              <p className="text-sm text-blue-300 mt-4">Audio is muted</p>
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

        @keyframes wave {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.5);
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
