/**
 * Script to populate the knowledge base with Muro Lucano data
 * Run this script to import all monuments and content into Supabase
 *
 * Usage: tsx src/scripts/populate-knowledge-base.ts
 */

import { monuments, knowledgeContent } from '../data/muro-lucano-data';
import { batchInsertData } from '../lib/knowledge-base';

async function main() {
  console.log('🚀 Starting knowledge base population...\n');
  console.log(`📊 Data Summary:`);
  console.log(`   - Monuments: ${monuments.length}`);
  console.log(`   - Knowledge Items: ${knowledgeContent.length}`);
  console.log('');

  try {
    console.log('💾 Inserting data into Supabase...');
    await batchInsertData(monuments, knowledgeContent);

    console.log('\n✅ Knowledge base populated successfully!');
    console.log('\n📈 Summary:');
    console.log(`   ✓ ${monuments.length} monuments inserted`);
    console.log(`   ✓ ${knowledgeContent.length} knowledge items inserted`);
    console.log(`   ✓ All embeddings generated`);
    console.log('\n🎉 Ready for semantic search!');

  } catch (error) {
    console.error('\n❌ Error populating knowledge base:', error);
    process.exit(1);
  }
}

main();
