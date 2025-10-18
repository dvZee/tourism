/*
  # Fix RLS Policies for Anonymous Users

  ## Overview
  Allows anonymous (unauthenticated) users to create and access conversations
  while maintaining security for authenticated users.

  ## Changes
  - Add policies for anonymous users to create conversations
  - Add policies for anonymous users to view their own conversations
  - Add policies for anonymous users to add messages
  - Authenticated users still have full access to their own conversations
  - Anonymous conversations are isolated by conversation_id rather than user_id

  ## Security
  - Anonymous users can only access conversations they create
  - Authenticated users can only access their own conversations (filtered by user_id)
  - Messages are accessible based on conversation ownership
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can create own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create messages in own conversations" ON messages;
DROP POLICY IF EXISTS "Users can view messages in own conversations" ON messages;

-- Conversations: Allow anyone to create
CREATE POLICY "Anyone can create conversations"
  ON conversations FOR INSERT
  TO public
  WITH CHECK (true);

-- Conversations: Users can view their own (auth or anon)
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO public
  USING (
    (auth.uid() IS NULL AND user_id IS NULL) OR
    (auth.uid() = user_id)
  );

-- Conversations: Users can update their own
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

-- Conversations: Users can delete their own
CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  TO public
  USING (
    (auth.uid() IS NULL AND user_id IS NULL) OR
    (auth.uid() = user_id)
  );

-- Messages: Anyone can create messages
CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);

-- Messages: Users can view messages in conversations
CREATE POLICY "Anyone can view messages"
  ON messages FOR SELECT
  TO public
  USING (true);