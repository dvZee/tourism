import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Globe, User, Sparkles, MapPin, BookOpen } from 'lucide-react';
import { AIAgent, createConversation, getPersonas } from '../lib/ai-agent';
import type { Persona, Message } from '../lib/supabase';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agent, setAgent] = useState<AIAgent | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'it' | 'es'>('en');
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const personasList = await getPersonas();
      setPersonas(personasList);

      const conversationId = await createConversation(language);
      const newAgent = new AIAgent(conversationId, language);
      setAgent(newAgent);
      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  };

  const handlePersonaChange = async (personaId: string) => {
    if (!agent) return;
    setSelectedPersona(personaId);
    await agent.setPersona(personaId);
  };

  const handleLanguageChange = async (lang: 'en' | 'it' | 'es') => {
    setLanguage(lang);
    const conversationId = await createConversation(lang, selectedPersona || undefined);
    const newAgent = new AIAgent(conversationId, lang);
    if (selectedPersona) {
      await newAgent.setPersona(selectedPersona);
    }
    setAgent(newAgent);
    setMessages([]);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="relative inline-block">
            <Globe className="w-16 h-16 text-blue-400 animate-pulse" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
          </div>
          <p className="mt-4 text-blue-200 font-medium">Initializing your guide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2djRoLTR2LTRoNHptMCA2djRoLTR2LTRoNHptLTYgNnY0aC00di00aDR6bS02IDB2NGgtNHYtNGg0em0tNi02djRoLTR2LTRoNHptMC02djRoLTR2LTRoNHptNiAwdjRoLTR2LTRoNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      <header className="relative bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white bg-clip-text">AI Tourism Assistant</h1>
                <p className="text-sm text-blue-200 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Your personal guide to Italian heritage
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2 bg-white/5 backdrop-blur-sm p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('it')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  language === 'it'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                Italiano
              </button>
              <button
                onClick={() => handleLanguageChange('es')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  language === 'es'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                Español
              </button>
            </div>

            <select
              value={selectedPersona}
              onChange={(e) => handlePersonaChange(e.target.value)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer"
            >
              <option value="" className="bg-slate-900">Select persona...</option>
              {personas.map((persona) => (
                <option key={persona.id} value={persona.id} className="bg-slate-900">
                  {persona.name.charAt(0).toUpperCase() + persona.name.slice(1)} - {persona.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 rounded-full shadow-2xl">
                  <Globe className="w-12 h-12 text-white animate-pulse" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-3 bg-clip-text">
                Welcome to Your AI Tourism Guide
              </h2>
              <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Ask me anything about Italian monuments, history, legends, and culture. I'm here to make your visit memorable!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <button
                  onClick={() => setInput("Tell me about the Colosseum")}
                  className="group p-6 text-left bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">Tell me about the Colosseum</p>
                      <p className="text-sm text-blue-200">Learn about ancient Rome</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setInput("What are some Italian legends?")}
                  className="group p-6 text-left bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">Italian legends</p>
                      <p className="text-sm text-blue-200">Discover folklore and stories</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-4 animate-slide-up ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                        : 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Globe className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-2xl p-5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                        : 'bg-white/95 backdrop-blur-sm text-gray-900 border border-white/20'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-4 animate-slide-up">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 max-w-2xl p-5 rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl border border-white/20">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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

      <footer className="relative bg-white/10 backdrop-blur-xl border-t border-white/20">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about monuments, history, legends..."
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-blue-200/60 transition-all disabled:opacity-50"
                disabled={loading}
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-300 opacity-50" />
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="relative px-8 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white rounded-2xl hover:shadow-2xl hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 disabled:hover:shadow-none hover:scale-105 active:scale-95 font-medium"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
