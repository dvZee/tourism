/**
 * Script to populate the knowledge base with Muro Lucano data
 * Run this script to import all monuments and content into Supabase
 *
 * Usage: npm run populate-kb
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, '../../.env');
const envContent = readFileSync(envPath, 'utf8');

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  }
});

import { monuments, knowledgeContent } from '../data/muro-lucano-data.js';
import { batchInsertData } from '../lib/knowledge-base-node.js';

async function main() {
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

  if (!hasOpenAIKey) {
    console.error('\n❌ Missing OpenAI API key!');
    console.error('Please add VITE_OPENAI_API_KEY to your .env file.');
    console.error('Get your key from: https://platform.openai.com/api-keys');
    process.exit(1);
  }

  console.log('\n📊 Data Summary:');
  console.log(`   - Monuments: ${monuments.length}`);
  console.log(`   - Knowledge Items: ${knowledgeContent.length}`);

  try {
    await batchInsertData(monuments, knowledgeContent);

    console.log('\n✅ Knowledge base populated successfully!');
    console.log('\n🎉 Ready for semantic search!');
    console.log('\nYou can now:');
    console.log('  1. Start the app: npm run dev');
    console.log('  2. Ask questions about Muro Lucano monuments');
    console.log('  3. Test in English, Italian, or Spanish');

  } catch (error) {
    console.error('\n❌ Error populating knowledge base:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
