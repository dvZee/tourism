import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Conversation } from '../lib/supabase';

type ChatHistoryProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conversationId: string) => void;
  currentConversationId?: string;
  userId: string;
};

export default function ChatHistory({
  isOpen,
  onClose,
  onSelectConversation,
  currentConversationId,
  userId,
}: ChatHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen, userId]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages(id)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const conversationsWithMessages = (data || []).filter(
        (conv: any) => conv.messages && conv.messages.length > 0
      );
      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setConversations(conversations.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in font-breton">
      <div className="bg-white/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg max-h-[85vh] border border-white/20 flex flex-col animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent-primary" />
            <h2 className="text-xl font-bold text-bg-primary">Chat History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start chatting to create your first conversation
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    onSelectConversation(conversation.id);
                    onClose();
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all group hover:scale-[1.02] ${
                    currentConversationId === conversation.id
                      ? 'bg-accent-primary text-white shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {conversation.title || 'New Conversation'}
                      </h3>
                      <p
                        className={`text-sm mt-1 ${
                          currentConversationId === conversation.id
                            ? 'text-white/80'
                            : 'text-gray-500'
                        }`}
                      >
                        {new Date(conversation.updated_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteConversation(conversation.id, e)}
                      className={`p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                        currentConversationId === conversation.id
                          ? 'hover:bg-accent-primary/80'
                          : 'hover:bg-gray-200'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
