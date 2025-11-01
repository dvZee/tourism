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

console.log('🚀 Populating knowledge base WITHOUT embeddings...\n');
console.log('ℹ️  You can add embeddings later when you have OpenAI credits\n');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

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
    // Get monument IDs
    const { data: monuments, error: fetchError } = await supabase
      .from('monuments')
      .select('id, slug');

    if (fetchError) {
      throw new Error(`Failed to fetch monuments: ${fetchError.message}`);
    }

    const slugToId = new Map(monuments.map(m => [m.slug, m.id]));

    console.log('📝 Inserting knowledge items (without embeddings)...\n');

    const processedItems = knowledgeContent.map(item => {
      if (item.location) {
        const slug = item.location.toLowerCase().replace(/\s+/g, '-');
        item.monument_id = slugToId.get(slug);
      }

      return {
        ...item,
        embedding: null,
        word_count: item.content.split(/\s+/).length,
        language: 'it'
      };
    });

    const { error: knowledgeError } = await supabase
      .from('knowledge_base')
      .insert(processedItems);

    if (knowledgeError) {
      throw new Error(`Failed to insert knowledge: ${knowledgeError.message}`);
    }

    console.log(`✅ Inserted ${processedItems.length} knowledge items\n`);
    console.log('🎉 Knowledge base populated successfully!\n');
    console.log('📊 Summary:');
    console.log(`   ✓ ${monuments.length} monuments`);
    console.log(`   ✓ ${processedItems.length} knowledge items`);
    console.log('   ⚠️  Embeddings: Not generated (will use keyword search)\n');
    console.log('ℹ️  To add embeddings later:');
    console.log('   1. Add OpenAI credits to your account');
    console.log('   2. Run: npm run populate-kb');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
