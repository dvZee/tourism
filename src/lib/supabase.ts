import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Persona = {
  id: string;
  name: string;
  description: string;
  tone_instructions: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  persona_id: string | null;
  language: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type KnowledgeBase = {
  id: string;
  title: string;
  content: string;
  category: string;
  location: string | null;
  tags: string[];
  language: string;
  embedding: number[] | null;
  created_at: string;
  updated_at: string;
};
