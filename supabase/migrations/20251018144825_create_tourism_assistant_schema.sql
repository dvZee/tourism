/*
  # AI Tourism Assistant - Initial Schema

  ## Overview
  Creates the foundational database structure for the AI Tourism Assistant application.
  This migration sets up tables for conversations, messages, knowledge base, and user personas.

  ## New Tables
  
  ### `personas`
  Stores predefined persona types that affect AI tone and content depth
  - `id` (uuid, primary key)
  - `name` (text) - e.g., "child", "adult", "couple", "family"
  - `description` (text) - Description of the persona
  - `tone_instructions` (text) - Instructions for AI tone adaptation
  - `created_at` (timestamptz)

  ### `conversations`
  Tracks chat sessions with tourists
  - `id` (uuid, primary key)
  - `persona_id` (uuid, foreign key) - Selected persona for this conversation
  - `language` (text) - User's preferred language (it, en, es)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `messages`
  Stores individual messages within conversations
  - `id` (uuid, primary key)
  - `conversation_id` (uuid, foreign key)
  - `role` (text) - 'user' or 'assistant'
  - `content` (text) - Message content
  - `created_at` (timestamptz)

  ### `knowledge_base`
  Stores cultural information, stories, and monument data
  - `id` (uuid, primary key)
  - `title` (text) - Monument or topic name
  - `content` (text) - Detailed information
  - `category` (text) - e.g., "monument", "legend", "history"
  - `location` (text) - Geographic location
  - `tags` (text[]) - Searchable tags
  - `language` (text) - Content language
  - `embedding` (vector(1536)) - For semantic search
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for personas and knowledge_base
  - Conversations and messages accessible without auth for MVP (will add auth in Phase 2)

  ## Indexes
  - Index on conversation_id for messages lookup
  - Index on language for knowledge_base filtering
  - Vector index for semantic search on knowledge_base
*/

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create personas table
CREATE TABLE IF NOT EXISTS personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  tone_instructions text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id uuid REFERENCES personas(id),
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create knowledge_base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  location text,
  tags text[] DEFAULT '{}',
  language text NOT NULL DEFAULT 'it',
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_language ON knowledge_base(language);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Enable Row Level Security
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- RLS Policies for personas (public read)
CREATE POLICY "Anyone can view personas"
  ON personas FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for conversations (public access for MVP)
CREATE POLICY "Anyone can create conversations"
  ON conversations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view conversations"
  ON conversations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update conversations"
  ON conversations FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for messages (public access for MVP)
CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view messages"
  ON messages FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for knowledge_base (public read)
CREATE POLICY "Anyone can view knowledge base"
  ON knowledge_base FOR SELECT
  TO anon
  USING (true);

-- Insert default personas
INSERT INTO personas (name, description, tone_instructions) VALUES
  ('child', 'For young visitors (ages 5-12)', 'Use simple language, short sentences, exciting tone, and fun facts. Make history feel like an adventure story. Avoid complex historical details.'),
  ('adult', 'For general adult tourists', 'Use clear, informative language with historical context. Balance facts with storytelling. Include dates, historical significance, and cultural context.'),
  ('couple', 'For romantic travelers', 'Focus on romantic elements, legends of love, scenic beauty, and intimate details. Use warm, engaging tone with emotional connections to the place.'),
  ('family', 'For families with mixed ages', 'Balance content for both children and adults. Include interactive elements, fun facts for kids, and deeper context for parents. Suggest family-friendly activities.')
ON CONFLICT (name) DO NOTHING;