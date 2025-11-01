#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = readFileSync('.env', 'utf8');

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('🚀 Starting knowledge base population...\n');

console.log('🔍 Checking environment variables...');
const hasSupabaseUrl = !!process.env.VITE_SUPABASE_URL;
const hasSupabaseKey = !!process.env.VITE_SUPABASE_ANON_KEY;
const hasOpenAIKey = !!process.env.VITE_OPENAI_API_KEY;

console.log(`   VITE_SUPABASE_URL: ${hasSupabaseUrl ? '✓' : '✗'}`);
console.log(`   VITE_SUPABASE_ANON_KEY: ${hasSupabaseKey ? '✓' : '✗'}`);
console.log(`   VITE_OPENAI_API_KEY: ${hasOpenAIKey ? '✓' : '✗'}`);

if (!hasSupabaseUrl || !hasSupabaseKey) {
  console.error('\n❌ Missing Supabase environment variables!');
  console.error('Please check your .env file.');
  process.exit(1);
}

if (!hasOpenAIKey || process.env.VITE_OPENAI_API_KEY === 'ADD_YOUR_KEY_HERE') {
  console.error('\n❌ Missing or invalid OpenAI API key!');
  console.error('Please add VITE_OPENAI_API_KEY to your .env file.');
  console.error('Get your key from: https://platform.openai.com/api-keys\n');
  console.error('Update .env file:');
  console.error('VITE_OPENAI_API_KEY=sk-proj-your-actual-key-here');
  process.exit(1);
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function generateEmbedding(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`
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

const monuments = [
  {
    name_it: 'Canyon delle Ripe',
    name_en: 'Ripe Canyon',
    name_es: 'Cañón de las Ripe',
    slug: 'canyon-delle-ripe',
    category: 'nature',
    description_short: 'Un irripetibile paradiso naturale, profonda gola tra pareti di rocce calcaree',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['nature', 'canyon', 'hiking', 'biodiversity'],
    is_featured: true
  },
  {
    name_it: 'Castello',
    name_en: 'Castle',
    name_es: 'Castillo',
    slug: 'castello',
    category: 'monument',
    description_short: 'Castello medievale normanno dell\'XI secolo, corona lucente della città',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['history', 'medieval', 'architecture', 'castle'],
    is_featured: true
  },
  {
    name_it: 'Cattedrale',
    name_en: 'Cathedral',
    name_es: 'Catedral',
    slug: 'cattedrale',
    category: 'religious',
    description_short: 'Cattedrale a croce latina con origini rupestri del XI secolo',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['religion', 'church', 'architecture', 'art'],
    is_featured: true
  },
  {
    name_it: 'Casa di San Gerardo Maiella',
    name_en: 'Saint Gerard Maiella House',
    name_es: 'Casa de San Gerardo Maiella',
    slug: 'casa-san-gerardo',
    category: 'religious',
    description_short: 'Casa natale di San Gerardo Maiella, patrono della Basilicata',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['religion', 'saint', 'history', 'museum'],
    is_featured: true
  }
];

const knowledgeContent = [
  {
    title: 'Canyon delle Ripe - Descrizione',
    content: `Questo è il posto in cui il cielo bacia l'acqua e le ruba la voce. Le Ripe di Muro Lucano sono un irripetibile paradiso naturale sovrascritto dall'opera tutta umana che lo ha attraversato e conquistato. La statua di San Gerardo eretta a protezione e devozione, rivolge lo sguardo e spalanca le braccia verso il cuore urbanizzato della città che a lui guarda, devoto.

La stretta gola nata tra le pareti di rocce calcaree sedimentarie è il letto del fiume Rescio, interrotto a tratti da giganti di roccia caduti a seguito dell'erosione delle profonde e ripide pareti. Macigni e forme carsiche diventano anfratti, gole e piccole grotte ricche di stalattiti e stalagmiti dal fascino misterioso.`,
    content_type: 'description',
    category: 'nature',
    location: 'Canyon delle Ripe',
    tags: ['canyon', 'nature', 'geology', 'fiume rescio']
  },
  {
    title: 'Castello - Storia Medievale',
    content: `Nella memoria del tempo l'ombra dell'imponente Castello medievale di Muro Lucano proietta linee e profili sulla roccia secoli prima della sua costruzione. Quello che era stato un piccolo forte di epoca longobarda diventerà nel XI secolo realtà chiara nei progetti di edificazione dei Normanni, giunti sulle colline murane durante la campagna di conquista dell'Italia meridionale.

A partire dal 1269 il castello sarà parte dei beni della Corona. Le vicende legate al castello non furono sempre bagnate dalla luce. Il castello e la torre furono parte del destino crudele della Regina Giovanna I d'Angiò che venne soffocata nel 1382 per ordine di Carlo di Durazzo.`,
    content_type: 'history',
    category: 'monument',
    location: 'Castello',
    tags: ['medieval', 'normans', 'queen giovanna']
  },
  {
    title: 'Cattedrale - Architettura',
    content: `La facciata della Cattedrale sembra sospirare davanti alla bellezza del centro lucano adagiato ai suoi piedi. Indossa un abito di luce ispirato ai raggi del sole d'autunno e cela un cuore antico e profondo, oggi parte dell'immenso patrimonio architettonico di Muro Lucano.

La nuova Cattedrale a croce latina ti accoglie con le quattro lesene con capitelli corinzi al di sotto del frontone triangolare. Sono diversi i documenti che fanno risalire le prime fondamenta della cattedrale rupestre interrata al XI secolo.`,
    content_type: 'description',
    category: 'religious',
    location: 'Cattedrale',
    tags: ['architecture', 'church', 'romanesque']
  },
  {
    title: 'San Gerardo Maiella - Vita del Santo',
    content: `È qui, al civico 65 del Borgo Pianello, che nasce il 6 aprile 1726 San Gerardo. L'umile casa in cui Gerardo schiuse gli occhi e in cui visse fino a 6/7 anni è irta su pochi gradini che la sollevano di pochi metri rispetto alla viuzza in pietra del Borgo.

Gerardo era unico figlio maschio della famiglia dopo le sorelle Brigida, Anna ed Elisabetta. Fu il luogo in cui fin da piccolo sentì forte lo Spirito e il desiderio ardente di lodare e celebrare Gesù. A Materdonimi, a soli 29 anni, Gerardo lasciò la vita terrena. Nel cuore la vocazione e la purezza di quello che di sé disse "vado a farmi santo" e santo fu.`,
    content_type: 'history',
    category: 'religious',
    location: 'Casa di San Gerardo Maiella',
    tags: ['saint', 'biography', 'religion', 'patrono basilicata']
  }
];

async function main() {
  try {
    console.log('\n📍 Inserting monuments...');

    const { data: insertedMonuments, error: monumentError } = await supabase
      .from('monuments')
      .insert(monuments)
      .select('id, slug');

    if (monumentError) {
      throw new Error(`Failed to insert monuments: ${monumentError.message}`);
    }

    console.log(`✅ Inserted ${insertedMonuments.length} monuments\n`);

    const slugToId = new Map(insertedMonuments.map(m => [m.slug, m.id]));

    console.log('📝 Processing knowledge items...');
    console.log('⏳ Generating embeddings (this will take ~30 seconds)...\n');

    const processedItems = [];

    for (let i = 0; i < knowledgeContent.length; i++) {
      const item = knowledgeContent[i];

      try {
        if (item.location) {
          const slug = item.location.toLowerCase().replace(/\s+/g, '-');
          item.monument_id = slugToId.get(slug);
        }

        const textToEmbed = `${item.title}\n\n${item.content}`;

        console.log(`[${i + 1}/${knowledgeContent.length}] ${item.title.substring(0, 50)}...`);

        const embedding = await generateEmbedding(textToEmbed);

        processedItems.push({
          ...item,
          embedding,
          word_count: item.content.split(/\s+/).length,
          language: 'it'
        });

      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}`);
      }
    }

    console.log('\n💾 Inserting knowledge items into database...');

    const { error: knowledgeError } = await supabase
      .from('knowledge_base')
      .insert(processedItems);

    if (knowledgeError) {
      throw new Error(`Failed to insert knowledge: ${knowledgeError.message}`);
    }

    console.log(`✅ Inserted ${processedItems.length} knowledge items`);

    console.log('\n🎉 Knowledge base populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`   ✓ ${insertedMonuments.length} monuments`);
    console.log(`   ✓ ${processedItems.length} knowledge items`);
    console.log('\nYou can now test the chatbot with questions like:');
    console.log('  - "Tell me about the castle"');
    console.log('  - "What is the Canyon delle Ripe?"');
    console.log('  - "Who is San Gerardo?"');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
