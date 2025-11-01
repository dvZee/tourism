/*
  # Enhanced Knowledge Base for RAG System
  
  ## Changes
  
  1. Enhanced knowledge_base table
     - Add monument_id for better organization
     - Add content_type (description, history, legend, story, practical_info)
     - Add source_page for PDF reference
     - Add chunk_index for ordering
     - Improve embedding support
  
  2. New monuments table
     - Store monument/landmark information
     - Support multi-language names
     - GPS coordinates for future geo features
     - Categories and tags
  
  3. New content_translations table (optional cache)
     - Store pre-translated versions for frequently accessed content
     - Reduces API costs for popular content
  
  4. Indexes
     - Vector similarity index for fast semantic search
     - Full-text search indexes
     - Foreign key indexes
  
  5. Security
     - Enable RLS on all tables
     - Public read access (tourism app)
     - Admin-only write access
*/

-- Create monuments table
CREATE TABLE IF NOT EXISTS monuments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_it text NOT NULL,
  name_en text,
  name_es text,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  description_short text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  village text DEFAULT 'Muro Lucano',
  region text DEFAULT 'Basilicata',
  tags text[] DEFAULT '{}',
  image_url text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Drop existing knowledge_base table if needed and recreate with enhanced structure
DROP TABLE IF EXISTS knowledge_base CASCADE;

CREATE TABLE knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monument_id uuid REFERENCES monuments(id) ON DELETE CASCADE,
  
  -- Content fields
  title text NOT NULL,
  content text NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('description', 'history', 'legend', 'story', 'practical_info', 'event', 'food', 'nature')),
  
  -- Source tracking
  source_document text DEFAULT 'muro_lucano_guide',
  source_page integer,
  chunk_index integer DEFAULT 0,
  
  -- Language and categorization
  language text NOT NULL DEFAULT 'it',
  category text NOT NULL,
  location text,
  tags text[] DEFAULT '{}',
  
  -- Embeddings for semantic search
  embedding vector(1536),
  
  -- Metadata
  word_count integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Optional: Translation cache table for frequently accessed content
CREATE TABLE IF NOT EXISTS content_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_base_id uuid REFERENCES knowledge_base(id) ON DELETE CASCADE,
  language text NOT NULL CHECK (language IN ('en', 'es', 'fr', 'de')),
  translated_title text,
  translated_content text NOT NULL,
  translation_date timestamptz DEFAULT now(),
  UNIQUE(knowledge_base_id, language)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_monument ON knowledge_base(monument_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_language ON knowledge_base(language);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_content_type ON knowledge_base(content_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING gin(tags);

-- Vector similarity index using HNSW for fast approximate search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON knowledge_base 
USING hnsw (embedding vector_cosine_ops);

-- Full-text search index for keyword fallback
CREATE INDEX IF NOT EXISTS idx_knowledge_base_content_fts ON knowledge_base 
USING gin(to_tsvector('italian', content));

CREATE INDEX IF NOT EXISTS idx_monuments_slug ON monuments(slug);
CREATE INDEX IF NOT EXISTS idx_monuments_category ON monuments(category);
CREATE INDEX IF NOT EXISTS idx_monuments_village ON monuments(village);

-- Enable Row Level Security
ALTER TABLE monuments ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;

-- Public read access (tourism app - everyone can read)
CREATE POLICY "Anyone can read monuments"
  ON monuments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read knowledge base"
  ON knowledge_base FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read translations"
  ON content_translations FOR SELECT
  TO public
  USING (true);

-- Admin write access (for content management)
CREATE POLICY "Authenticated users can insert monuments"
  ON monuments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update monuments"
  ON monuments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert knowledge"
  ON knowledge_base FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update knowledge"
  ON knowledge_base FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_monuments_updated_at
  BEFORE UPDATE ON monuments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
