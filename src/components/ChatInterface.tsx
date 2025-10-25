import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Globe, User, Sparkles, MapPin, BookOpen, PanelLeftOpen, History, LogOut, UserCircle, Plus, Mic, MicOff } from 'lucide-react';
import { AIAgent, createConversation, getPersonas, loadConversation } from '../lib/ai-agent';
import { getCurrentUser, signOut, getUserProfile } from '../lib/auth';
import type { Persona, Message } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { UserProfile } from '../lib/auth';
import AuthModal from './AuthModal';
import ChatHistory from './ChatHistory';
import WelcomeAnimation from './WelcomeAnimation';
import { supabase } from '../lib/supabase';
import { getTranslation, type Language } from '../lib/translations';
import { useVoiceChat } from '../hooks/useVoiceChat';

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
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
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
    const convId = await createConversation(lang, selectedPersona || undefined, user?.id);
    setConversationId(convId);
    const newAgent = new AIAgent(convId, lang);
    if (selectedPersona) {
      await newAgent.setPersona(selectedPersona);
    }
    setAgent(newAgent);
    setMessages([]);
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

      if (voiceChat.isSupported) {
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
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg-primary font-breton relative overflow-hidden" style={{ height: '100dvh' }}>

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
      </main>

      <footer className="relative bg-white/10 backdrop-blur-xl border-t border-white/20 flex-shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="relative">
            {voiceChat.isSupported && (
              <button
                onClick={handleVoiceInput}
                disabled={loading}
                className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg transition-all duration-300 ${
                  voiceChat.isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title={voiceChat.isListening ? 'Stop listening' : 'Start voice input'}
              >
                {voiceChat.isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={voiceChat.isListening ? 'Listening...' : getTranslation(language, 'inputPlaceholder')}
              className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent text-white placeholder-white/60 transition-all disabled:opacity-50 text-sm sm:text-base"
              disabled={loading || voiceChat.isListening}
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
    </div>
  );
}
