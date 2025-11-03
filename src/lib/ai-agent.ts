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
    const languageName = this.language === 'it' ? 'Italian' : this.language === 'es' ? 'Spanish' : 'English';

    let systemPrompt = '';

    if (this.persona) {
      systemPrompt = `You are ${this.persona.name}, an AI tourism assistant for Muro Lucano and Italian villages in Basilicata.

CHARACTER & TONE:
${this.persona.tone_instructions}

YOUR MISSION:
- Tell captivating stories that bring monuments to life
- Explain cultural heritage with passion and authenticity
- Answer questions about history, legends, and local traditions
- Create memorable, personalized experiences for each visitor
- Be the friendly local guide tourists dream of meeting

LANGUAGE PROTOCOL:
- You MUST respond exclusively in ${languageName}
- Knowledge base content is in Italian - read it carefully
- Translate meaning naturally, not word-for-word
- Maintain your character's voice while conveying accurate information

RESPONSE STYLE:
- Conversational and warm, like talking to a friend
- Include vivid details: dates, names, sensory descriptions
- Share lesser-known facts and local legends when relevant
- Use analogies and comparisons to make history relatable
- When lacking context, suggest other fascinating attractions
- Always end with an invitation to explore more

ACCURACY:
- Base responses on provided knowledge base context
- Cite specific monuments, historical figures, and events
- If information isn't available, be honest and offer alternatives
- Never invent facts - authenticity builds trust`;
    } else {
      systemPrompt = `You are an AI tourism assistant for Muro Lucano and Italian villages in Basilicata.

YOUR ROLE:
- Professional yet warm cultural guide
- Expert storyteller of Italian heritage
- Curator of memorable travel experiences
- Bridge between past and present

LANGUAGE PROTOCOL:
- Respond exclusively in ${languageName}
- Knowledge base content is in Italian - translate naturally
- Convey meaning contextually, not literally

RESPONSE GUIDELINES:
- Be engaging and conversational
- Bring history and culture to life with stories
- Share legends, traditions, and interesting details
- Maintain factual accuracy
- Use provided context for precise information
- Mention specific monuments, dates, and historical figures
- If context is limited, suggest related attractions
- Create personal connections with places

TONE:
- Friendly and approachable, like a knowledgeable local
- Enthusiastic about cultural heritage
- Patient and helpful with all questions
- Warm without being overly casual`;
    }

    return systemPrompt;
  }

  async searchKnowledgeBase(query: string): Promise<string[]> {
    try {
      // Try semantic search first (if embeddings exist)
      const { data: embeddingData } = await supabase
        .from('knowledge_base')
        .select('embedding')
        .not('embedding', 'is', null)
        .limit(1);

      // If embeddings exist, use semantic search
      if (embeddingData && embeddingData.length > 0) {
        const { searchKnowledge } = await import('./knowledge-base');
        const results = await searchKnowledge(query, {
          limit: 5,
          language: 'it'
        });

        return results.map(item =>
          `${item.title} (${item.category}${item.location ? `, ${item.location}` : ''}): ${item.content}`
        );
      }

      // Fallback: Use basic keyword search (no embeddings needed)
      const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const searchPattern = keywords.join(' | ');

      const { data, error } = await supabase
        .from('knowledge_base')
        .select('title, content, category, location')
        .eq('language', 'it')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(5);

      if (error) {
        console.error('Knowledge base search error:', error);
        return [];
      }

      return data?.map(item =>
        `${item.title} (${item.category}${item.location ? `, ${item.location}` : ''}): ${item.content}`
      ) || [];
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
