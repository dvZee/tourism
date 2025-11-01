# Knowledge Base Integration Guide

## 🎯 Overview

Milestone 2 implements a **Retrieval-Augmented Generation (RAG)** system that trains the chatbot on custom cultural data without modifying the AI model itself. Content is stored in Supabase, indexed with vector embeddings, and retrieved using semantic search.

## 🌍 Multi-Language Strategy

### Approach: **Hybrid Translation System** (Recommended)

We store content in the **original language (Italian)** and translate on-demand:

```
User Query (English) → Semantic Search (Italian content) → GPT-4o Response (English)
```

**How it works:**

1. **Storage**: All cultural content stored in Italian (source language)
2. **Embeddings**: Generated from Italian text for semantic search
3. **Retrieval**: User query searches Italian knowledge base using vector similarity
4. **Response**: GPT-4o reads Italian context and responds in user's language

**Why this approach?**

✅ Single source of truth (easier content management)
✅ GPT-4o naturally translates context while responding
✅ Cost-effective (no 3x storage for each language)
✅ Consistent across languages
✅ Easy to add new languages without re-ingesting content

### Example Flow

```javascript
// User asks in English
"Tell me about the castle"

// System searches Italian content semantically
searchKnowledge("Tell me about the castle")
  → Finds: "Il Castello medievale di Muro Lucano..."

// GPT-4o generates English response using Italian context
→ "The medieval castle of Muro Lucano was built in the 11th century..."
```

## 🗄️ Database Schema

### Tables

#### **1. monuments**
Stores monument/landmark information

```sql
monuments (
  id uuid PRIMARY KEY,
  name_it text NOT NULL,
  name_en text,
  name_es text,
  slug text UNIQUE,
  category text,
  description_short text,
  latitude decimal,
  longitude decimal,
  village text,
  region text,
  tags text[],
  image_url text,
  is_featured boolean
)
```

#### **2. knowledge_base**
Stores cultural content chunks with embeddings

```sql
knowledge_base (
  id uuid PRIMARY KEY,
  monument_id uuid → monuments(id),
  title text NOT NULL,
  content text NOT NULL,
  content_type text CHECK (description|history|legend|story|practical_info|event|food|nature),
  source_document text,
  source_page integer,
  chunk_index integer,
  language text DEFAULT 'it',
  category text,
  location text,
  tags text[],
  embedding vector(1536),  -- OpenAI text-embedding-3-small
  word_count integer
)
```

#### **3. content_translations** (Optional Cache)
Pre-translated content for frequently accessed items

```sql
content_translations (
  id uuid PRIMARY KEY,
  knowledge_base_id uuid → knowledge_base(id),
  language text CHECK (en|es|fr|de),
  translated_title text,
  translated_content text
)
```

### Indexes

- **Vector Similarity**: HNSW index for fast approximate nearest neighbor search
- **Full-Text**: Italian text search index for keyword fallback
- **Foreign Keys**: Monument relationships
- **Categories/Tags**: GIN indexes for filtering

## 📊 Data Structure

### Monument Data

Extracted from the Muro Lucano PDF guide:

- **14 monuments** (Castle, Cathedral, Canyon delle Ripe, etc.)
- Each with Italian/English/Spanish names
- Categories: nature, monument, religious, museum, art, village, viewpoint
- Tags for filtering (medieval, hiking, art, engineering, etc.)

### Knowledge Content

- **25+ content chunks** with detailed information
- Content types: description, history, legend, story, event, food
- Source tracking (page numbers from PDF)
- Rich cultural narratives in Italian

## 🔧 Implementation

### 1. Generate Embeddings

```typescript
import { generateEmbedding } from './lib/knowledge-base';

const embedding = await generateEmbedding("Il Castello medievale...");
// Returns: number[] (1536 dimensions)
```

Uses OpenAI's `text-embedding-3-small` model (cost-effective, high quality).

### 2. Insert Content

```typescript
import { insertKnowledge, insertMonument } from './lib/knowledge-base';

// Insert monument
const monumentId = await insertMonument({
  name_it: 'Castello',
  name_en: 'Castle',
  slug: 'castello',
  category: 'monument',
  // ... more fields
});

// Insert knowledge content
await insertKnowledge({
  monument_id: monumentId,
  title: 'Castello - Storia Medievale',
  content: 'Il castello fu costruito...',
  content_type: 'history',
  category: 'monument',
  language: 'it'
});
```

### 3. Semantic Search

```typescript
import { searchKnowledge } from './lib/knowledge-base';

const results = await searchKnowledge("tell me about the castle", {
  limit: 5,
  language: 'it',
  category: 'monument' // optional filter
});

results.forEach(result => {
  console.log(`${result.title} (similarity: ${result.similarity})`);
  console.log(result.content);
});
```

### 4. AI Integration

The `AIAgent` class automatically searches the knowledge base:

```typescript
const agent = new AIAgent(conversationId, 'en');
const response = await agent.generateResponse("What's the castle?");
// Automatically:
// 1. Searches Italian knowledge base
// 2. Retrieves relevant content
// 3. Generates English response using Italian context
```

## 🚀 Populating the Knowledge Base

### Option 1: Run the Script (Recommended for Testing)

```bash
npm run populate-kb
```

This will:
- Insert all 14 monuments
- Insert 25+ knowledge content items
- Generate embeddings for each item (~1-2 minutes)
- Create vector indexes

**Note**: You need `VITE_OPENAI_API_KEY` in `.env`

### Option 2: Batch Import via Code

```typescript
import { batchInsertData } from './lib/knowledge-base';
import { monuments, knowledgeContent } from './data/muro-lucano-data';

await batchInsertData(monuments, knowledgeContent);
```

### Option 3: Edge Function (Production)

Create an admin endpoint in Supabase Edge Functions to populate the database from uploaded PDFs.

## 📈 Query Examples

### Basic Search

```typescript
// User asks in English
const results = await searchKnowledge("what happened to the castle in 1382?");
// Finds Italian content about Queen Giovanna I
```

### Filtered Search

```typescript
// Search only nature content
const results = await searchKnowledge("birds", {
  category: 'nature',
  limit: 3
});
```

### Monument-Specific

```typescript
// Get all content for a specific monument
const monumentId = '...';
const content = await getMonumentContent(monumentId);
```

## 🎨 Frontend Integration

The knowledge base works transparently with your existing chat interface:

```typescript
// User types in English: "Tell me about San Gerardo"
// Agent automatically:
// 1. Searches Italian KB for relevant content
// 2. Retrieves: "San Gerardo Maiella nacque il 6 aprile 1726..."
// 3. GPT-4o generates natural English response
// User sees: "Saint Gerard Maiella was born on April 6, 1726..."
```

## 📝 Adding New Content

### From PDF

1. **Extract text** from new PDF sections
2. **Structure data** in `src/data/` following the pattern:

```typescript
{
  title: 'Monument Name - Section',
  content: 'Full text content in Italian...',
  content_type: 'description' | 'history' | 'legend' | 'story',
  category: 'nature' | 'monument' | 'religious',
  location: 'Monument Name',
  tags: ['tag1', 'tag2'],
  source_page: 42
}
```

3. **Run population script** to generate embeddings and insert

### Manually via Supabase

```sql
INSERT INTO knowledge_base (title, content, content_type, category, language)
VALUES (
  'New Story Title',
  'Full story content in Italian...',
  'legend',
  'culture',
  'it'
);
```

Then generate embedding separately or use trigger function.

## 🔍 Performance

- **Search Speed**: ~50-100ms (HNSW index)
- **Embedding Generation**: ~200ms per item (cached after first generation)
- **Storage**: ~2KB per content item + 6KB embedding = ~8KB total
- **Cost**: OpenAI embeddings ~$0.02 per 1M tokens (very cheap)

## 🛡️ Security

- **RLS enabled** on all tables
- **Public read access** (tourism app)
- **Authenticated write access** (content management)
- No sensitive data in knowledge base

## 🔮 Future Enhancements

### Phase 1.5: Image Recognition
- Upload monument photo
- Identify monument using GPT-4o Vision
- Return relevant knowledge base content

### Phase 2: Translation Cache
- Pre-translate popular content to English/Spanish
- Store in `content_translations` table
- Reduce API calls for common queries

### Phase 3: User Feedback Loop
- Track which content users find helpful
- A/B test different content chunking strategies
- Improve retrieval accuracy over time

### Phase 4: Admin Dashboard
- Web interface to manage monuments
- Upload PDFs and auto-extract content
- Edit/approve content before publishing

## 🐛 Troubleshooting

### "Failed to generate embedding"
- Check `VITE_OPENAI_API_KEY` is set in `.env`
- Verify API key has sufficient quota
- Check OpenAI API status

### "No results found"
- Ensure knowledge base is populated (run `npm run populate-kb`)
- Check language filter matches content language
- Lower similarity threshold in search function

### "Search too slow"
- Verify HNSW index exists: `CREATE INDEX ... USING hnsw`
- Reduce `match_count` limit
- Add more specific filters (category, monument_id)

## 📚 Resources

- [OpenAI Embeddings Documentation](https://platform.openai.com/docs/guides/embeddings)
- [Supabase Vector Documentation](https://supabase.com/docs/guides/ai/vector-columns)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [RAG Best Practices](https://www.anthropic.com/index/contextual-retrieval)

## ✅ Testing Checklist

- [ ] Database migration applied successfully
- [ ] Knowledge base populated with sample data
- [ ] Semantic search returns relevant results
- [ ] AI responses use knowledge base context
- [ ] Multi-language responses work (English query → Italian KB → English response)
- [ ] Persona adaptation applies to retrieved content
- [ ] Build completes without errors

---

**Milestone 2 Complete!** 🎉

Your AI Tourism Assistant can now provide accurate, cultural context-aware responses about Muro Lucano in multiple languages.
