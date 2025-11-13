import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Send, Loader2, Globe, User, Sparkles, MapPin, BookOpen, PanelLeftOpen, History, LogOut, UserCircle, Plus, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { AIAgent, createConversation, getPersonas, loadConversation } from '../lib/ai-agent';
import { getCurrentUser, signOut, getUserProfile } from '../lib/auth';
import type { Persona, Message } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { UserProfile } from '../lib/auth';
import AuthModal from './AuthModal';
import ChatHistory from './ChatHistory';
import { supabase } from '../lib/supabase';
import { getTranslation, type Language } from '../lib/translations';
import { useVoiceChat } from '../hooks/useVoiceChat';

const WelcomeAnimation = lazy(() => import('./WelcomeAnimation'));

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agent, setAgent] = useState<AIAgent | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [language, setLanguage] = useState<Language>('it');
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    return !hasSeenWelcome;
  });
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languageMap: Record<Language, string> = {
    'en': 'en-US',
    'it': 'it-IT',
    'es': 'es-ES'
  };

  const voiceChat = useVoiceChat(languageMap[language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
        loadUserProfile(session?.user?.id || '');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      await loadUserProfile(currentUser.id);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
      if (profile?.preferred_language) {
        setLanguage(profile.preferred_language as 'en' | 'it' | 'es');
      }
      if (profile?.preferred_persona_id) {
        setSelectedPersona(profile.preferred_persona_id);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const initializeChat = async () => {
    try {
      const personasList = await getPersonas();
      setPersonas(personasList);

      const currentUser = await getCurrentUser();
      const convId = await createConversation(language, undefined, currentUser?.id);
      setConversationId(convId);
      const newAgent = new AIAgent(convId, language);
      setAgent(newAgent);
      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setInitialized(true);
    }
  };

  const startNewConversation = async () => {
    if (!user && messages.length > 0) {
      setShowSavePrompt(true);
      return;
    }

    try {
      const convId = await createConversation(language, selectedPersona || undefined, user?.id);
      setConversationId(convId);
      const newAgent = new AIAgent(convId, language);
      if (selectedPersona) {
        await newAgent.setPersona(selectedPersona);
      }
      setAgent(newAgent);
      setMessages([]);
      setShowMobileMenu(false);
      setShowSavePrompt(false);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleEndConversationWithoutSave = async () => {
    setShowSavePrompt(false);
    const convId = await createConversation(language, selectedPersona || undefined, user?.id);
    setConversationId(convId);
    const newAgent = new AIAgent(convId, language);
    if (selectedPersona) {
      await newAgent.setPersona(selectedPersona);
    }
    setAgent(newAgent);
    setMessages([]);
    setShowMobileMenu(false);
  };

  const handleSelectConversation = async (convId: string) => {
    try {
      setConversationId(convId);
      const newAgent = new AIAgent(convId, language);
      setAgent(newAgent);
      const history = await loadConversation(convId);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handlePersonaChange = async (personaId: string) => {
    if (!agent) return;
    setSelectedPersona(personaId);
    await agent.setPersona(personaId);
  };

  const handleLanguageChange = async (lang: 'en' | 'it' | 'es') => {
    setLanguage(lang);
    if (agent) {
      agent.language = lang;
    }
    setShowMobileMenu(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowMobileMenu(false);
    await initializeChat();
  };

  const sendMessage = async () => {
    if (!input.trim() || !agent || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const tempUserMessage: Message = {
      id: Date.now().toString(),
      conversation_id: '',
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await agent.generateResponse(userMessage);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: '',
        role: 'assistant',
        content: response.content,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (voiceChat.isSupported && voiceChat.isVoiceMode) {
        voiceChat.speak(response.content);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: '',
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (voiceChat.transcript && !loading) {
      setInput(voiceChat.transcript);
    }
  }, [voiceChat.transcript, loading]);

  useEffect(() => {
    if (voiceChat.isVoiceMode && voiceChat.transcript && !voiceChat.isListening && !loading) {
      const currentInput = voiceChat.transcript.trim();
      if (currentInput) {
        const processMessage = async () => {
          await sendMessage();
          voiceChat.clearTranscript();
        };
        processMessage();
      }
    }
  }, [voiceChat.isListening, voiceChat.isVoiceMode]);

  useEffect(() => {
    if (voiceChat.isVoiceMode && !voiceChat.isSpeaking && !voiceChat.isListening && !loading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setTimeout(() => {
          if (voiceChat.isVoiceMode && !voiceChat.isListening && !voiceChat.isSpeaking) {
            voiceChat.startListening();
          }
        }, 1000);
      }
    }
  }, [messages, voiceChat.isSpeaking, voiceChat.isVoiceMode, loading]);

  const handleVoiceInput = () => {
    if (voiceChat.isListening) {
      voiceChat.stopListening();
      if (input.trim()) {
        sendMessage();
      }
    } else {
      voiceChat.startListening();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!initialized) {
    return null;
  }

  if (showWelcome) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center h-full bg-bg-primary"><Loader2 className="w-12 h-12 text-accent-primary animate-spin" /></div>}>
        <WelcomeAnimation
          onComplete={() => {
            localStorage.setItem('hasSeenWelcome', 'true');
            setShowWelcome(false);
          }}
          onSkip={() => {
            localStorage.setItem('hasSeenWelcome', 'true');
            setShowWelcome(false);
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col h-full bg-bg-primary font-breton relative overflow-hidden">

      <header className="relative bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl font-breton">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="w-12 h-12 bg-accent-primary rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="w-3 h-3 text-accent-primary absolute -top-0.5 -right-0.5 animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-white">{getTranslation(language, 'appTitle')}</h1>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {getTranslation(language, 'appSubtitle')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 bg-white/5 backdrop-blur-sm p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/50 scale-105'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {getTranslation(language, 'english')}
                </button>
                <button
                  onClick={() => handleLanguageChange('it')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    language === 'it'
                      ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/50 scale-105'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {getTranslation(language, 'italian')}
                </button>
                <button
                  onClick={() => handleLanguageChange('es')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    language === 'es'
                      ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/50 scale-105'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {getTranslation(language, 'spanish')}
                </button>
              </div>

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={startNewConversation}
                    className="p-2 hover:bg-white/20 text-white rounded-xl transition-all"
                    title={getTranslation(language, 'newChat')}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowChatHistory(true)}
                    className="p-2 hover:bg-white/20 text-white rounded-xl transition-all"
                    title={getTranslation(language, 'chatHistory')}
                  >
                    <History className="w-5 h-5" />
                  </button>
                  <div className="h-6 w-px bg-white/20"></div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-white/20 text-white rounded-xl transition-all group"
                    title="Sign out"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="text-sm font-medium hidden xl:inline max-w-32 truncate">
                      {userProfile?.display_name || user.email?.split('@')[0]}
                    </span>
                    <LogOut className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-accent-primary/50 transition-all"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm">{getTranslation(language, 'signIn')}</span>
                </button>
              )}

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-2 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            </div>
          </div>

          {user && personas.length > 0 && (
            <div className="hidden md:flex items-center justify-center gap-2 mt-3 pt-3 border-t border-white/10">
              <span className="text-xs text-white/70 font-medium">Persona:</span>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm p-1 rounded-lg border border-white/10">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => handlePersonaChange(persona.id)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
                      selectedPersona === persona.id
                        ? 'bg-accent-primary text-white shadow-md'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {persona.name.charAt(0).toUpperCase() + persona.name.slice(1)}
                  </button>
                ))}
                {selectedPersona && (
                  <button
                    onClick={() => handlePersonaChange('')}
                    className="px-3 py-1 rounded-md text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
                  >
                    Default
                  </button>
                )}
              </div>
            </div>
          )}

          {showMobileMenu && (
            <div className="sm:hidden mt-4 pt-4 border-t border-white/20 space-y-2 animate-slide-up">
              <div className="flex gap-2">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    language === 'en'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {getTranslation(language, 'english')}
                </button>
                <button
                  onClick={() => handleLanguageChange('it')}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    language === 'it'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {getTranslation(language, 'italian')}
                </button>
                <button
                  onClick={() => handleLanguageChange('es')}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    language === 'es'
                      ? 'bg-accent-primary text-white'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {getTranslation(language, 'spanish')}
                </button>
              </div>
              <select
                value={selectedPersona}
                onChange={(e) => handlePersonaChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-white/10 border border-white/20 text-white"
              >
                <option value="" className="bg-slate-900">Select persona...</option>
                {personas.map((persona) => (
                  <option key={persona.id} value={persona.id} className="bg-slate-900">
                    {persona.name.charAt(0).toUpperCase() + persona.name.slice(1)} - {persona.description}
                  </option>
                ))}
              </select>
              {user ? (
                <>
                  <button
                    onClick={startNewConversation}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 text-white rounded-xl text-xs font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    New Conversation
                  </button>
                  <button
                    onClick={() => {
                      setShowChatHistory(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 text-white rounded-xl text-xs font-medium"
                  >
                    <History className="w-4 h-4" />
                    Chat History
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 text-white rounded-xl text-xs font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent-primary text-white rounded-xl text-xs font-medium"
                >
                  <UserCircle className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {voiceChat.isVoiceMode ? (
          <div className="h-full flex items-center justify-center px-4">
            <div className="text-center max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className={`absolute inset-0 rounded-full blur-3xl opacity-40 animate-pulse ${
                  loading ? 'bg-yellow-500' : voiceChat.isListening ? 'bg-red-500' : voiceChat.isSpeaking ? 'bg-blue-500' : 'bg-accent-primary'
                }`}></div>
                <div className={`relative w-48 h-48 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${
                  loading
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-600 shadow-2xl shadow-yellow-500/50 scale-110'
                    : voiceChat.isListening
                    ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/50 scale-110'
                    : voiceChat.isSpeaking
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl shadow-blue-500/50 scale-110'
                    : 'bg-gradient-to-br from-accent-primary to-purple-600 shadow-2xl shadow-accent-primary/50'
                }`}>
                  {loading ? (
                    <Loader2 className="w-24 h-24 text-white animate-spin" />
                  ) : voiceChat.isListening ? (
                    <Mic className="w-24 h-24 text-white animate-pulse" />
                  ) : voiceChat.isSpeaking ? (
                    <Volume2 className="w-24 h-24 text-white animate-pulse" />
                  ) : (
                    <Volume2 className="w-24 h-24 text-white" />
                  )}
                </div>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-4 border-yellow-500/30 animate-ping"></div>
                  </div>
                )}
                {voiceChat.isListening && !loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-4 border-red-500/30 animate-ping"></div>
                  </div>
                )}
                {voiceChat.isSpeaking && !loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-4 border-blue-500/30 animate-ping"></div>
                  </div>
                )}
              </div>

              <h2 className="text-4xl font-bold text-white mb-4">
                {loading ? getTranslation(language, 'thinking') || 'Thinking...' :
                 voiceChat.isListening ? getTranslation(language, 'listening') || 'Listening...' :
                 voiceChat.isSpeaking ? getTranslation(language, 'speaking') || 'Speaking...' :
                 getTranslation(language, 'voiceModeReady') || 'Ready to listen'}
              </h2>

              {voiceChat.transcript && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
                  <p className="text-white/80 text-lg">{voiceChat.transcript}</p>
                </div>
              )}

              {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
                  <p className="text-gray-900 text-lg leading-relaxed">{messages[messages.length - 1].content}</p>
                </div>
              )}

              <p className="text-white/60 text-sm">
                {loading ? 'Processing your question and searching knowledge base...' :
                 voiceChat.isListening ? getTranslation(language, 'speakNow') || 'Speak your question now' :
                 voiceChat.isSpeaking ? getTranslation(language, 'aiResponding') || 'AI is responding' :
                 getTranslation(language, 'waitingForYou') || 'Waiting for your question'}
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {messages.length === 0 ? (
            <div className="text-center py-12 sm:py-16 animate-fade-in">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-accent-primary rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-accent-primary rounded-full shadow-2xl">
                  <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
                {getTranslation(language, 'welcomeTitle')}
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                {getTranslation(language, 'welcomeSubtitle')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto px-4">
                <button
                  onClick={() => setInput(getTranslation(language, 'exampleColosseum'))}
                  className="group p-4 sm:p-6 text-left bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:border-accent-primary/50 hover:shadow-2xl hover:shadow-accent-primary/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent-primary rounded-lg group-hover:scale-110 transition-transform">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1 text-sm sm:text-base">{getTranslation(language, 'exampleColosseum')}</p>
                      <p className="text-xs sm:text-sm text-white/70">{getTranslation(language, 'exampleColeosseumSubtitle')}</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setInput(getTranslation(language, 'exampleLegends'))}
                  className="group p-4 sm:p-6 text-left bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:border-accent-primary/50 hover:shadow-2xl hover:shadow-accent-primary/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent-primary rounded-lg group-hover:scale-110 transition-transform">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1 text-sm sm:text-base">{getTranslation(language, 'exampleLegends')}</p>
                      <p className="text-xs sm:text-sm text-white/70">{getTranslation(language, 'exampleLegendsSubtitle')}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-3 sm:gap-4 animate-slide-up ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg ${
                      message.role === 'user'
                        ? 'bg-accent-primary'
                        : 'bg-accent-primary'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-2xl p-4 sm:p-5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                      message.role === 'user'
                        ? 'bg-accent-primary text-white'
                        : 'bg-white/95 backdrop-blur-sm text-gray-900 border border-white/20'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 sm:gap-4 animate-slide-up">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent-primary flex items-center justify-center shadow-lg">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1 max-w-2xl p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl border border-white/20">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-accent-primary" />
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          </div>
        )}
      </main>

      <footer className="relative bg-white/10 backdrop-blur-xl border-t border-white/20 flex-shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          {voiceChat.isVoiceMode ? (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={voiceChat.toggleVoiceMode}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-2xl shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 text-lg font-semibold"
              >
                <VolumeX className="w-6 h-6" />
                {getTranslation(language, 'exitVoiceMode') || 'Exit Voice Mode'}
              </button>
            </div>
          ) : (
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={getTranslation(language, 'inputPlaceholder')}
                  className="w-full pl-4 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent text-white placeholder-white/60 transition-all disabled:opacity-50 text-sm sm:text-base"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg bg-accent-primary text-white hover:bg-accent-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95"
                  title="Send message"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {voiceChat.isSupported && (
                <button
                  onClick={voiceChat.toggleVoiceMode}
                  disabled={loading}
                  className="px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                  title="Enable voice chat mode"
                >
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          checkAuth();
          initializeChat();
        }}
      />

      {user && (
        <ChatHistory
          isOpen={showChatHistory}
          onClose={() => setShowChatHistory(false)}
          onSelectConversation={handleSelectConversation}
          currentConversationId={conversationId}
          userId={user.id}
        />
      )}

      {showSavePrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {getTranslation(language, 'saveConversationTitle')}
              </h2>
              <p className="text-white/70 text-sm">
                {getTranslation(language, 'saveConversationMessage')}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                {getTranslation(language, 'createAccount')}
              </button>
              <button
                onClick={handleEndConversationWithoutSave}
                className="w-full px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors duration-200"
              >
                {getTranslation(language, 'continueWithoutSaving')}
              </button>
              <button
                onClick={() => setShowSavePrompt(false)}
                className="w-full px-6 py-3 text-white/70 hover:text-white transition-colors duration-200 text-sm"
              >
                {getTranslation(language, 'cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
