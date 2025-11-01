import { supabase } from './supabase';

export interface Monument {
  id?: string;
  name_it: string;
  name_en?: string;
  name_es?: string;
  slug: string;
  category: string;
  description_short?: string;
  latitude?: number;
  longitude?: number;
  village?: string;
  region?: string;
  tags?: string[];
  image_url?: string;
  is_featured?: boolean;
}

export interface KnowledgeContent {
  id?: string;
  monument_id?: string;
  title: string;
  content: string;
  content_type: 'description' | 'history' | 'legend' | 'story' | 'practical_info' | 'event' | 'food' | 'nature';
  source_document?: string;
  source_page?: number;
  chunk_index?: number;
  language?: string;
  category: string;
  location?: string;
  tags?: string[];
  embedding?: number[];
  word_count?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  similarity: number;
  monument?: Monument;
}

/**
 * Generate embedding using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to generate embedding: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Insert a monument into the database
 */
export async function insertMonument(monument: Monument): Promise<string> {
  const { data, error } = await supabase
    .from('monuments')
    .insert(monument)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to insert monument: ${error.message}`);
  }

  return data.id;
}

/**
 * Insert knowledge content with embeddings
 */
export async function insertKnowledge(content: KnowledgeContent): Promise<string> {
  // Generate embedding if not provided
  if (!content.embedding) {
    const textToEmbed = `${content.title}\n\n${content.content}`;
    content.embedding = await generateEmbedding(textToEmbed);
  }

  // Calculate word count
  if (!content.word_count) {
    content.word_count = content.content.split(/\s+/).length;
  }

  const { data, error } = await supabase
    .from('knowledge_base')
    .insert({
      ...content,
      language: content.language || 'it'
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to insert knowledge: ${error.message}`);
  }

  return data.id;
}

/**
 * Semantic search in knowledge base
 */
export async function searchKnowledge(
  query: string,
  options: {
    limit?: number;
    category?: string;
    monument_id?: string;
    content_type?: string;
    language?: string;
  } = {}
): Promise<SearchResult[]> {
  const {
    limit = 5,
    category,
    monument_id,
    content_type,
    language = 'it'
  } = options;

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Build the query
  let query_builder = supabase.rpc('search_knowledge_semantic', {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,
    match_count: limit
  });

  // Add filters
  if (category) {
    query_builder = query_builder.eq('category', category);
  }
  if (monument_id) {
    query_builder = query_builder.eq('monument_id', monument_id);
  }
  if (content_type) {
    query_builder = query_builder.eq('content_type', content_type);
  }
  if (language) {
    query_builder = query_builder.eq('language', language);
  }

  const { data, error } = await query_builder;

  if (error) {
    console.error('Search error:', error);
    throw new Error(`Failed to search knowledge: ${error.message}`);
  }

  return data || [];
}

/**
 * Get monument by slug
 */
export async function getMonumentBySlug(slug: string): Promise<Monument | null> {
  const { data, error } = await supabase
    .from('monuments')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to get monument: ${error.message}`);
  }

  return data;
}

/**
 * Get all content for a monument
 */
export async function getMonumentContent(monumentId: string): Promise<KnowledgeContent[]> {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('monument_id', monumentId)
    .order('chunk_index', { ascending: true });

  if (error) {
    throw new Error(`Failed to get monument content: ${error.message}`);
  }

  return data || [];
}

/**
 * Batch insert monuments and content
 */
export async function batchInsertData(
  monuments: Monument[],
  knowledgeItems: KnowledgeContent[]
): Promise<void> {
  console.log(`Inserting ${monuments.length} monuments...`);

  // Insert monuments first
  const { data: insertedMonuments, error: monumentError } = await supabase
    .from('monuments')
    .insert(monuments)
    .select('id, slug');

  if (monumentError) {
    throw new Error(`Failed to batch insert monuments: ${monumentError.message}`);
  }

  console.log(`Successfully inserted ${insertedMonuments.length} monuments`);

  // Create slug to ID mapping
  const slugToId = new Map(
    insertedMonuments.map(m => [m.slug, m.id])
  );

  // Update knowledge items with monument IDs and generate embeddings
  console.log(`Processing ${knowledgeItems.length} knowledge items...`);

  const processedItems = [];
  for (const item of knowledgeItems) {
    try {
      // Find monument ID by matching location/title
      if (item.location && !item.monument_id) {
        const slug = item.location.toLowerCase().replace(/\s+/g, '-');
        item.monument_id = slugToId.get(slug);
      }

      // Generate embedding
      const textToEmbed = `${item.title}\n\n${item.content}`;
      const embedding = await generateEmbedding(textToEmbed);

      processedItems.push({
        ...item,
        embedding,
        word_count: item.content.split(/\s+/).length,
        language: item.language || 'it'
      });

      // Log progress every 10 items
      if (processedItems.length % 10 === 0) {
        console.log(`Processed ${processedItems.length}/${knowledgeItems.length} items...`);
      }
    } catch (error) {
      console.error(`Failed to process item: ${item.title}`, error);
    }
  }

  // Batch insert knowledge items
  const { error: knowledgeError } = await supabase
    .from('knowledge_base')
    .insert(processedItems);

  if (knowledgeError) {
    throw new Error(`Failed to batch insert knowledge: ${knowledgeError.message}`);
  }

  console.log(`Successfully inserted ${processedItems.length} knowledge items`);
}
