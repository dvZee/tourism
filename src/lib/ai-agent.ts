import { supabase } from './supabase';
import type { Persona, Message } from './supabase';

export type AIResponse = {
  content: string;
  sources?: string[];
};

export class AIAgent {
  private conversationId: string;
  private persona: Persona | null = null;
  private language: string;

  constructor(conversationId: string, language: string = 'en') {
    this.conversationId = conversationId;
    this.language = language;
  }

  async setPersona(personaId: string) {
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('id', personaId)
      .maybeSingle();

    if (error) throw error;
    this.persona = data;

    await supabase
      .from('conversations')
      .update({ persona_id: personaId })
      .eq('id', this.conversationId);
  }

  async getConversationHistory(): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', this.conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async saveMessage(role: 'user' | 'assistant', content: string) {
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: this.conversationId,
        role,
        content,
      });

    if (error) throw error;
  }

  private buildSystemPrompt(): string {
    const basePrompt = `You are an AI tourism assistant for Muro Lucano and Italian villages in Basilicata. Your role is to tell stories, explain monuments, answer questions about culture and history, and create memorable experiences for tourists.

Language: You MUST respond in ${this.language === 'it' ? 'Italian' : this.language === 'es' ? 'Spanish' : 'English'}.

IMPORTANT: The knowledge base context provided to you is in Italian. If the user asks in English or Spanish:
1. Understand their question
2. Use the Italian context provided
3. Respond naturally in ${this.language === 'it' ? 'Italian' : this.language === 'es' ? 'Spanish' : 'English'}
4. DO NOT translate word-for-word; instead, convey the meaning naturally

Guidelines:
- Be engaging and conversational, like a friendly local guide
- Tell stories that bring history to life
- Share legends, cultural insights, and interesting details
- Be factual but entertaining
- When given context, use it to provide accurate information
- Mention specific monuments, dates, and historical figures from the context
- If you don't have enough context, offer to tell them about other attractions
- Create a personal connection with the place`;

    if (this.persona) {
      return `${basePrompt}

Persona: ${this.persona.name}
${this.persona.tone_instructions}`;
    }

    return basePrompt;
  }

  async searchKnowledgeBase(query: string): Promise<string[]> {
    try {
      // Import dynamically to avoid circular dependencies
      const { searchKnowledge } = await import('./knowledge-base');

      // Search using semantic similarity (embeddings)
      // Content is in Italian, so we search in Italian
      const results = await searchKnowledge(query, {
        limit: 5,
        language: 'it'
      });

      return results.map(item =>
        `${item.title} (${item.category}${item.location ? `, ${item.location}` : ''}): ${item.content}`
      );
    } catch (error) {
      console.error('Knowledge base search error:', error);
      return [];
    }
  }

  async generateResponse(userMessage: string): Promise<AIResponse> {
    await this.saveMessage('user', userMessage);

    const history = await this.getConversationHistory();
    const knowledgeContext = await this.searchKnowledgeBase(userMessage);

    const systemPrompt = this.buildSystemPrompt();

    let contextInfo = '';
    if (knowledgeContext.length > 0) {
      contextInfo = '\n\nRelevant information from knowledge base:\n' + knowledgeContext.join('\n\n');
    }

    const messages = [
      { role: 'system', content: systemPrompt + contextInfo },
      ...history.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await this.callAI(messages);

    await this.saveMessage('assistant', response.content);

    if (history.length === 1) {
      await this.updateConversationTitle(userMessage);
    }

    return response;
  }

  private async updateConversationTitle(firstMessage: string) {
    const title = firstMessage.length > 50
      ? firstMessage.substring(0, 50) + '...'
      : firstMessage;

    await supabase
      .from('conversations')
      .update({ title })
      .eq('id', this.conversationId);
  }

  private async callAI(messages: Array<{ role: string; content: string }>): Promise<AIResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages, language: this.language },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.error) {
        console.error('AI API error:', data.error);
        throw new Error(data.error);
      }

      if (data?.content) {
        return { content: data.content, sources: data.sources || [] };
      }

      return data;
    } catch (error) {
      console.error('AI call failed:', error);
      return {
        content: this.getFallbackResponse(),
      };
    }
  }

  private getFallbackResponse(): string {
    const responses = {
      en: "I'm having trouble connecting right now, but I'd love to help you explore this place. Could you tell me more about what you'd like to know?",
      it: "Al momento ho difficoltà di connessione, ma mi piacerebbe aiutarti a esplorare questo luogo. Puoi dirmi di più su cosa vorresti sapere?",
      es: "Estoy teniendo problemas de conexión en este momento, pero me encantaría ayudarte a explorar este lugar. ¿Puedes contarme más sobre lo que te gustaría saber?",
    };
    return responses[this.language as keyof typeof responses] || responses.en;
  }
}

export async function createConversation(language: string = 'en', personaId?: string, userId?: string): Promise<string> {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      language,
      persona_id: personaId || null,
      user_id: userId || null,
      title: 'New Conversation',
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function loadConversation(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getPersonas(): Promise<Persona[]> {
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}
