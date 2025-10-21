/*
  # Complete Database Setup for Tourism Assistant

  This migration creates all necessary tables, policies, and functions.
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
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text DEFAULT 'New Conversation',
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

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  preferred_language text DEFAULT 'en',
  preferred_persona_id uuid REFERENCES personas(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_language ON knowledge_base(language);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);

-- Enable Row Level Security
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can view personas" ON personas;
DROP POLICY IF EXISTS "Anyone can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON conversations;
DROP POLICY IF EXISTS "Anyone can create messages" ON messages;
DROP POLICY IF EXISTS "Anyone can view messages" ON messages;
DROP POLICY IF EXISTS "Anyone can view knowledge base" ON knowledge_base;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- RLS Policies for personas (public read)
CREATE POLICY "Anyone can view personas"
  ON personas FOR SELECT
  TO public
  USING (true);

-- RLS Policies for conversations (allow anonymous and authenticated)
CREATE POLICY "Anyone can create conversations"
  ON conversations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO public
  USING (
    (auth.uid() IS NULL AND user_id IS NULL) OR
    (auth.uid() = user_id)
  );

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  TO public
  USING (
    (auth.uid() IS NULL AND user_id IS NULL) OR
    (auth.uid() = user_id)
  )
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL) OR
    (auth.uid() = user_id)
  );

CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  TO public
  USING (
    (auth.uid() IS NULL AND user_id IS NULL) OR
    (auth.uid() = user_id)
  );

-- RLS Policies for messages (allow anonymous and authenticated)
CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view messages"
  ON messages FOR SELECT
  TO public
  USING (true);

-- RLS Policies for knowledge_base (public read)
CREATE POLICY "Anyone can view knowledge base"
  ON knowledge_base FOR SELECT
  TO public
  USING (true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', new.email),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default personas
INSERT INTO personas (name, description, tone_instructions) VALUES
  ('child', 'For young visitors (ages 5-12)', 'Use simple language, short sentences, exciting tone, and fun facts. Make history feel like an adventure story. Avoid complex historical details.'),
  ('adult', 'For general adult tourists', 'Use clear, informative language with historical context. Balance facts with storytelling. Include dates, historical significance, and cultural context.'),
  ('couple', 'For romantic travelers', 'Focus on romantic elements, legends of love, scenic beauty, and intimate details. Use warm, engaging tone with emotional connections to the place.'),
  ('family', 'For families with mixed ages', 'Balance content for both children and adults. Include interactive elements, fun facts for kids, and deeper context for parents. Suggest family-friendly activities.')
ON CONFLICT (name) DO NOTHING;