/*
  # Create Semantic Search Function
  
  Creates a PostgreSQL function for vector similarity search
  using cosine distance for finding relevant knowledge base content.
*/

-- Function for semantic search using vector similarity
CREATE OR REPLACE FUNCTION search_knowledge_semantic(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  monument_id uuid,
  title text,
  content text,
  content_type text,
  category text,
  location text,
  tags text[],
  language text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.monument_id,
    kb.title,
    kb.content,
    kb.content_type,
    kb.category,
    kb.location,
    kb.tags,
    kb.language,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE kb.embedding IS NOT NULL
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
