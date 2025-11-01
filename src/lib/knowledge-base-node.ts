import { supabase } from './supabase-node';

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

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY not found in environment variables');
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
    const error = await response.text();
    throw new Error(`Failed to generate embedding: ${response.statusText} - ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

export async function batchInsertData(
  monuments: Monument[],
  knowledgeItems: KnowledgeContent[]
): Promise<void> {
  console.log(`\n📍 Inserting ${monuments.length} monuments...`);

  const { data: insertedMonuments, error: monumentError } = await supabase
    .from('monuments')
    .insert(monuments)
    .select('id, slug');

  if (monumentError) {
    throw new Error(`Failed to batch insert monuments: ${monumentError.message}`);
  }

  console.log(`✅ Successfully inserted ${insertedMonuments.length} monuments\n`);

  const slugToId = new Map(
    insertedMonuments.map(m => [m.slug, m.id])
  );

  console.log(`📝 Processing ${knowledgeItems.length} knowledge items...`);
  console.log(`⏳ Generating embeddings (this will take ~1-2 minutes)...\n`);

  const processedItems = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < knowledgeItems.length; i++) {
    const item = knowledgeItems[i];

    try {
      if (item.location && !item.monument_id) {
        const slug = item.location.toLowerCase().replace(/\s+/g, '-');
        item.monument_id = slugToId.get(slug);
      }

      const textToEmbed = `${item.title}\n\n${item.content}`;

      console.log(`[${i + 1}/${knowledgeItems.length}] Generating embedding for: ${item.title.substring(0, 50)}...`);

      const embedding = await generateEmbedding(textToEmbed);

      processedItems.push({
        ...item,
        embedding,
        word_count: item.content.split(/\s+/).length,
        language: item.language || 'it'
      });

      successCount++;

      if ((i + 1) % 5 === 0) {
        console.log(`   Progress: ${i + 1}/${knowledgeItems.length} items processed\n`);
      }
    } catch (error) {
      errorCount++;
      console.error(`   ❌ Failed to process item: ${item.title}`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  }

  console.log(`\n💾 Inserting ${processedItems.length} items into database...`);

  const { error: knowledgeError } = await supabase
    .from('knowledge_base')
    .insert(processedItems);

  if (knowledgeError) {
    throw new Error(`Failed to batch insert knowledge: ${knowledgeError.message}`);
  }

  console.log(`\n✅ Successfully inserted ${processedItems.length} knowledge items`);

  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} items failed to process`);
  }

  console.log(`\n📊 Final Summary:`);
  console.log(`   ✓ Monuments: ${insertedMonuments.length}`);
  console.log(`   ✓ Knowledge Items: ${successCount}`);
  console.log(`   ✗ Failed: ${errorCount}`);
}
