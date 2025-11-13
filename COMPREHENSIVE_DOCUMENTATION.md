# Muro Lucano Tourism AI Assistant - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Setup Instructions](#setup-instructions)
5. [Admin Guide](#admin-guide)
6. [User Guide](#user-guide)
7. [Voice Chat Feature](#voice-chat-feature)
8. [Database Schema](#database-schema)
9. [API Documentation](#api-documentation)
10. [Deployment](#deployment)
11. [Maintenance & Updates](#maintenance--updates)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

The Muro Lucano Tourism AI Assistant is an intelligent, multilingual chatbot designed to provide tourists with comprehensive information about Muro Lucano, Italy. The system uses advanced AI technology with RAG (Retrieval-Augmented Generation) to deliver accurate, contextual responses about local attractions, history, culture, and practical travel information.

### Key Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI**: OpenAI GPT-4 with RAG
- **Voice**: Web Speech API (Speech Recognition + Speech Synthesis)
- **Styling**: Tailwind CSS

---

## Features

### 1. Multilingual Support
- **English** (en)
- **Italian** (it)
- **Spanish** (es)
- Real-time language switching without losing conversation context

### 2. AI-Powered Responses
- Context-aware answers using RAG technology
- Semantic search through knowledge base
- Personalized responses based on user history
- Multiple persona modes (tour guide, local, historian)

### 3. Voice Chat (NEW - Milestone 3)
- **Voice-to-Voice Mode**: Continuous conversation mode
- **Speech Recognition**: Speak your questions naturally
- **Text-to-Speech**: Hear responses in your selected language
- **Auto-cycling**: Automatically listens after each response
- **Visual Indicators**: Shows when listening or speaking

### 4. User Authentication
- Email/password authentication
- User profiles with preferences
- Conversation history
- Favorite locations/topics

### 5. Admin Dashboard
- Document upload system
- Knowledge base management
- Upload history tracking
- Automatic document processing with embeddings

### 6. Conversation Management
- Save and load past conversations
- Export chat history
- Search through previous chats
- Anonymous mode for non-authenticated users

---

## Technical Architecture

### Frontend Architecture
```
src/
├── components/           # React components
│   ├── ChatInterface.tsx      # Main chat UI
│   ├── AdminDashboard.tsx     # Admin panel
│   ├── AuthModal.tsx          # Login/signup
│   ├── ChatHistory.tsx        # Conversation history
│   ├── WelcomeAnimation.tsx   # Welcome screen
│   └── VillageAnimation.tsx   # Background animations
├── hooks/
│   └── useVoiceChat.ts        # Voice chat functionality
├── lib/
│   ├── supabase.ts            # Supabase client
│   ├── ai-agent.ts            # AI logic
│   ├── auth.ts                # Authentication
│   ├── knowledge-base.ts      # KB queries
│   ├── admin.ts               # Admin functions
│   └── translations.ts        # i18n
└── data/
    └── muro-lucano-data.ts    # Initial data
```

### Backend Architecture
```
supabase/
├── migrations/                 # Database schema
│   ├── create_tourism_assistant_schema.sql
│   ├── add_authentication_and_user_profiles.sql
│   ├── enhance_knowledge_base_for_rag.sql
│   └── create_semantic_search_function.sql
└── functions/                  # Edge Functions
    ├── chat/                   # AI chat endpoint
    └── process-document/       # Document processing
```

### Database Schema

#### Core Tables

**knowledge_base**
- Stores all information chunks with embeddings
- Enables semantic search
- Categories: attractions, history, culture, food, accommodation, transportation, events

**conversations**
- Tracks all chat sessions
- Links to users and personas
- Stores language preference

**messages**
- Individual chat messages
- Role-based (user/assistant/system)
- Full conversation context

**user_profiles**
- User preferences (language, persona)
- Display names
- Account settings

**personas**
- Different AI personalities
- Custom system prompts
- Expertise areas

**uploaded_documents**
- Track admin uploads
- Processing status
- Chunk counts

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### 1. Clone Repository
```bash
git clone <repository-url>
cd project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. Database Setup
The migrations are already applied. Your Supabase database is configured with:
- All required tables
- Row Level Security policies
- Semantic search function
- pgvector extension for embeddings

### 5. Populate Knowledge Base
```bash
npm run populate-kb
```
This loads initial Muro Lucano data into the knowledge base.

### 6. Run Development Server
```bash
npm run dev
```
Access at: http://localhost:5173

### 7. Build for Production
```bash
npm run build
```

---

## Admin Guide

### Accessing Admin Panel

1. **Login** with admin credentials
2. Admin navigation bar appears at top
3. Click **"Admin Dashboard"** tab

### Uploading Documents

#### Supported Formats
- PDF (.pdf)
- Text files (.txt)
- Word documents (.docx)

#### Upload Process

1. **Navigate** to Admin Dashboard
2. **Drag & Drop** file or click to browse
3. **Processing Steps**:
   - File reading
   - Text extraction
   - Chunking (1000 characters per chunk)
   - Embedding generation (OpenAI)
   - Database storage
4. **Monitor Status**:
   - Pending: Waiting to process
   - Processing: Currently being processed
   - Completed: Successfully added to KB
   - Failed: Error occurred (check error message)

#### Best Practices for Document Upload

✅ **DO:**
- Upload well-structured documents
- Use clear, descriptive filenames
- Keep documents focused on specific topics
- Upload multiple smaller documents vs one large document
- Verify content is relevant to Muro Lucano tourism

❌ **DON'T:**
- Upload duplicate content
- Use corrupted or password-protected files
- Upload non-tourism related content
- Exceed reasonable file sizes (>10MB)

### Managing Knowledge Base

#### View Upload History
- See all uploaded documents
- Check processing status
- View chunk counts
- Monitor upload dates

#### Troubleshooting Failed Uploads
1. Check file format compatibility
2. Verify file is not corrupted
3. Ensure file size is reasonable
4. Check error message in dashboard
5. Re-upload if necessary

---

## User Guide

### Getting Started

#### First Time Users
1. **Welcome Animation** plays on first visit
2. Can skip or watch full intro
3. Default language: Italian

#### Language Selection
- Click language buttons in header
- English | Italian | Spanish
- **Conversation context preserved** (NEW in Milestone 3!)
- No need to start a new conversation when switching languages
- All previous messages remain visible
- AI responds in newly selected language
- Voice chat automatically uses new language

### Using the Chat

#### Asking Questions
**Example Questions:**
- "Tell me about the Norman Castle"
- "Where can I eat traditional food?"
- "What events happen in summer?"
- "How do I get to Muro Lucano from Naples?"

#### Conversation Tips
- Be specific in your questions
- Ask follow-up questions
- Use natural language
- Switch languages anytime

### Creating an Account

#### Benefits
- Save conversation history
- Set preferred language
- Choose default persona
- Access past conversations
- Personalized recommendations

#### Sign Up Process
1. Click **"Sign In"** button
2. Select **"Create Account"** tab
3. Enter email and password
4. Verify email (if enabled)
5. Complete profile

### Managing Conversations

#### Save Conversations
- Automatic saving for authenticated users
- Prompt to create account for anonymous users

#### View History
1. Click **History** icon in header
2. Browse past conversations
3. Click to load conversation
4. Continue from where you left off

#### Start New Conversation
- Click **"+"** button in header
- Starts fresh context
- Maintains language preference

### Persona Selection

The persona system adapts the AI's communication style to match different visitor types, providing personalized experiences for each tourist.

#### Available Personas

**1. Child (Ages 5-12)**
- **Description**: For young visitors exploring Muro Lucano
- **Communication Style**:
  - Simple, clear language
  - Short, exciting sentences
  - Fun facts and adventure stories
  - History told like fairy tales
  - Avoids complex historical details
- **Example**: "Wow! The castle is like a giant fortress from a storybook! Knights used to live here and protect the village from bad guys!"

**2. Adult (General Tourists)**
- **Description**: For adult travelers seeking comprehensive information
- **Communication Style**:
  - Clear, informative language
  - Historical context with dates and facts
  - Balance between storytelling and accuracy
  - Cultural significance explained
  - Practical travel information
- **Example**: "The Norman Castle dates back to the 11th century and played a crucial role in the region's defensive system. It offers panoramic views of the Basento Valley."

**3. Couple (Romantic Travelers)**
- **Description**: For romantic getaways and honeymoons
- **Communication Style**:
  - Focus on romantic elements and legends
  - Scenic beauty and atmosphere
  - Intimate dining spots
  - Sunset viewpoints
  - Love stories and folklore
  - Warm, engaging emotional tone
- **Example**: "As the sun sets behind the castle walls, the golden light bathes the ancient stones in warmth. Legend says couples who watch the sunset here together will return someday..."

**4. Family (Mixed Ages)**
- **Description**: For families with children and adults
- **Communication Style**:
  - Balanced content for all ages
  - Fun facts for children
  - Deeper context for parents
  - Family-friendly activities suggested
  - Interactive elements highlighted
  - Safe, engaging exploration tips
- **Example**: "The castle has towers that kids love to explore (perfect for young adventurers!), while parents can appreciate the remarkable 11th-century architecture and learn about the Norman conquest."

#### How Personas Work Technically

**System Prompts**: Each persona has custom instructions that guide the AI:
- Tone and style guidelines
- Vocabulary complexity level
- What to emphasize (adventure vs. history vs. romance)
- How to structure responses
- What details to include or avoid

**Context Preservation**:
- Persona applies to entire conversation
- Can be changed mid-conversation
- AI adapts responses instantly
- Previous messages retain their original persona style

**Database Storage**:
- Persona linked to each conversation
- User preferences saved (for authenticated users)
- Analytics track which personas are most popular

#### Changing Persona

**During Conversation**:
1. **Desktop**: Click persona buttons below language selector
2. **Mobile**: Use persona dropdown menu
3. **Effect**: Immediate - next response uses new persona
4. **Context**: Previous conversation history maintained

**Setting Default Persona** (Authenticated Users):
1. Login to your account
2. Go to Profile Settings
3. Select preferred persona
4. Saves automatically
5. All new conversations start with this persona

#### Best Practices for Persona Use

✅ **Recommended**:
- **Traveling with kids?** → Use "Family" or "Child" persona
- **Solo adult traveler?** → Use "Adult" persona
- **Romantic trip?** → Use "Couple" persona
- **School trip?** → Use "Child" persona for students
- **Photography tour?** → Use "Adult" or "Couple" for scenic spots

❌ **Not Recommended**:
- Switching personas constantly (causes inconsistent tone)
- Using "Child" for complex historical research
- Using "Couple" when traveling with family (unless just the couple)

#### Persona Examples in Action

**Question**: "Tell me about the Norman Castle"

**Child Response**:
"The Norman Castle is SO COOL! 🏰 It's a real medieval fortress that's almost 1000 years old! Can you imagine knights and soldiers guarding these huge walls? You can climb up the towers and pretend you're a brave knight protecting the village. The views from the top are amazing - you can see forever! It's like being on top of the world!"

**Adult Response**:
"The Norman Castle (Castello Normanno) is an 11th-century fortress that dominates Muro Lucano's historic center. Built during the Norman conquest of Southern Italy, it served as a strategic military outpost controlling the Basento Valley. The castle features typical Norman architectural elements including cylindrical towers, thick defensive walls, and elevated positioning for maximum visibility. Today, it's a key historical landmark offering panoramic views of the surrounding Basilicata countryside."

**Couple Response**:
"The Norman Castle crowns Muro Lucano like a jewel on a hillside, its ancient stones glowing warmly in the setting sun. Walking hand-in-hand through its romantic courtyards, you'll discover intimate corners perfect for quiet moments together. Local legend tells of a princess who waited in the tower for her beloved to return from battle - their love story is woven into the very stones. The sunset views from the castle ramparts are breathtaking, making it one of the most romantic spots in all of Basilicata."

**Family Response**:
"The Norman Castle is perfect for the whole family! Kids will love exploring the tall towers and thick walls - it's like stepping into a real-life medieval adventure (and great for imagination!). Parents will appreciate the impressive 11th-century architecture and the historical importance of this Norman fortress. There's plenty of space for children to safely explore while adults enjoy the stunning valley views. Pro tip: Bring a picnic and enjoy it in the castle grounds - the kids can run around while you relax!"

---

## Voice Chat Feature

### Overview
The Voice Chat feature enables completely hands-free, natural conversation with the AI assistant. It's perfect for tourists on-the-go who want information without typing. The system provides a smooth, continuous conversation experience with automatic cycling between listening and responding.

### How It Works

#### Enabling Voice Mode
1. Click the **microphone button** in the chat input area
2. Button turns **green with gradient** when voice mode is active
3. **Red indicator** (top-right of button) shows when listening
4. **Blue indicator** (bottom-right of button) shows when speaking

#### Voice Conversation Flow (Completely Automatic)
1. **Click microphone** → Activates continuous voice mode
2. **System listens** → Red dot pulses, speak your question
3. **Speech detected** → System captures and processes your words
4. **AI thinks** → Brief processing (1-2 seconds)
5. **AI responds** → Blue dot pulses, voice speaks the answer
6. **Auto-listen** → After 1 second, automatically starts listening again
7. **Continuous cycle** → Keeps repeating until you turn off voice mode
8. **Click microphone again** → Deactivates voice mode (button turns gray)

### Key Features

#### Smooth & Seamless
- **Continuous listening**: Set it and forget it
- **No manual intervention**: Completely hands-free after activation
- **Smart timing**: 1-second pause after AI speaks before listening again
- **Instant feedback**: Visual indicators show system state clearly

#### Language-Aware
- Voice recognition uses your selected language automatically
- Text-to-speech speaks in the same language
- Switch languages in the UI (conversation context preserved)
- Accent and dialect support varies by browser

#### Visual Feedback
- **Gray microphone**: Voice mode OFF
- **Green gradient microphone**: Voice mode ON
- **Red pulsing dot** (top-right): Currently listening to you
- **Blue pulsing dot** (bottom-right): Currently speaking to you
- **Both indicators**: Shows multi-modal state (transitioning)

### Supported Languages
Voice recognition and synthesis work in:
- **English** (en-US voice)
- **Italian** (it-IT voice)
- **Spanish** (es-ES voice)

System automatically uses the language selected in the interface.

### Voice Tips

✅ **Best Practices:**
- Speak clearly and at normal pace
- Use quiet environment for best recognition
- Wait for blue indicator to finish before speaking
- Ask one question at a time

❌ **Avoid:**
- Speaking while AI is talking (blue indicator)
- Very loud or noisy environments
- Mumbling or speaking too fast
- Background conversations

### Browser Compatibility

**Full Support:**
- Chrome/Edge (Recommended)
- Safari (macOS/iOS)

**Limited Support:**
- Firefox (may have delays)
- Opera

**Not Supported:**
- Internet Explorer
- Older mobile browsers

### Troubleshooting Voice

**Microphone Not Working:**
1. Check browser permissions
2. Allow microphone access
3. Verify microphone is working system-wide
4. Try refreshing the page

**Recognition Accuracy Issues:**
1. Switch to quieter location
2. Speak more clearly
3. Check selected language matches speech
4. Try text input for complex queries

**Voice Mode Won't Stop:**
- Click the green microphone button again
- Refresh page if stuck

---

## Database Schema

### Table Details

#### knowledge_base
```sql
id                UUID PRIMARY KEY
category          TEXT (attractions, history, culture, etc.)
topic            TEXT (specific subject)
content          TEXT (actual information)
language         TEXT (en, it, es)
embedding        VECTOR(1536) (for semantic search)
source           TEXT (document origin)
metadata         JSONB (additional data)
created_at       TIMESTAMPTZ
updated_at       TIMESTAMPTZ
```

**Indexes:**
- embedding (ivfflat for vector search)
- category, language
- topic (for filtering)

#### conversations
```sql
id                UUID PRIMARY KEY
user_id          UUID (nullable - anonymous support)
language         TEXT (en, it, es)
persona_id       UUID (nullable)
started_at       TIMESTAMPTZ
last_message_at  TIMESTAMPTZ
```

#### messages
```sql
id                UUID PRIMARY KEY
conversation_id  UUID (foreign key)
role             TEXT (user, assistant, system)
content          TEXT
created_at       TIMESTAMPTZ
```

#### user_profiles
```sql
id                     UUID PRIMARY KEY (same as auth.users.id)
display_name          TEXT (nullable)
preferred_language    TEXT (en, it, es)
preferred_persona_id  UUID (nullable)
created_at            TIMESTAMPTZ
updated_at            TIMESTAMPTZ
```

#### personas
```sql
id                UUID PRIMARY KEY
name              TEXT (tour_guide, local, historian)
description       TEXT
system_prompt     TEXT (AI instructions)
active            BOOLEAN
```

#### uploaded_documents
```sql
id                UUID PRIMARY KEY
user_id          UUID (admin who uploaded)
filename         TEXT
file_type        TEXT (mime type)
file_size        INTEGER (bytes)
status           TEXT (pending, processing, completed, failed)
chunks_created   INTEGER
error_message    TEXT (nullable)
uploaded_at      TIMESTAMPTZ
processed_at     TIMESTAMPTZ (nullable)
```

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

**knowledge_base**: Public read, admin write
**conversations**: Users can access own, anonymous can create
**messages**: Users can access own conversation messages
**user_profiles**: Users can read/update own profile
**personas**: Public read
**uploaded_documents**: Admin only

---

## API Documentation

### Edge Functions

#### /functions/v1/chat
**Purpose**: Process chat messages with AI

**Method**: POST

**Headers**:
```
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json
```

**Request Body**:
```json
{
  "message": "Tell me about the castle",
  "conversationId": "uuid",
  "language": "en"
}
```

**Response**:
```json
{
  "response": "The Norman Castle in Muro Lucano...",
  "sources": ["source1", "source2"]
}
```

#### /functions/v1/process-document
**Purpose**: Process uploaded documents into knowledge base

**Method**: POST

**Headers**:
```
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json
```

**Request Body**:
```json
{
  "chunks": ["text chunk 1", "text chunk 2"],
  "filename": "document.pdf",
  "documentId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "chunksProcessed": 42
}
```

### Supabase Client Methods

#### Knowledge Base Search
```typescript
import { searchKnowledgeBase } from './lib/knowledge-base';

const results = await searchKnowledgeBase(
  'castle history',
  'en',
  5 // limit
);
```

#### Authentication
```typescript
import { signIn, signUp, signOut } from './lib/auth';

// Sign up
await signUp(email, password, displayName);

// Sign in
await signIn(email, password);

// Sign out
await signOut();
```

#### AI Agent
```typescript
import { AIAgent } from './lib/ai-agent';

const agent = new AIAgent(conversationId, 'en');
await agent.setPersona(personaId);
const response = await agent.generateResponse('Hello');
```

---

## Deployment

### Deploying to Vercel

1. **Connect Repository**
```bash
vercel login
vercel link
```

2. **Set Environment Variables** in Vercel Dashboard:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_OPENAI_API_KEY
```

3. **Deploy**
```bash
vercel --prod
```

### Deploying to Netlify

1. **Build Configuration**
```
Build command: npm run build
Publish directory: dist
```

2. **Environment Variables** in Netlify Dashboard

3. **Deploy** via Git or CLI

### Supabase Edge Functions

Edge functions are already deployed to your Supabase project:
- `chat` - AI chat processing
- `process-document` - Document processing

To redeploy:
```bash
supabase functions deploy chat
supabase functions deploy process-document
```

---

## Maintenance & Updates

### Regular Maintenance Tasks

#### Weekly
- Review conversation logs
- Check error rates
- Monitor upload success rates
- Verify voice feature functionality

#### Monthly
- Update knowledge base with new content
- Review and improve AI responses
- Check for outdated information
- Update seasonal event information

#### Quarterly
- Dependency updates (`npm update`)
- Security patches
- Performance optimization
- User feedback implementation

### Updating Knowledge Base

#### Adding New Content
1. Prepare document in supported format
2. Login as admin
3. Upload via Admin Dashboard
4. Verify processing completed successfully
5. Test with relevant questions

#### Updating Existing Content
1. Upload new version of document
2. Old chunks remain until manually removed
3. Consider adding version metadata
4. Test changes thoroughly

### Database Backups

Supabase provides automatic backups. For manual backups:

```bash
# Export data
supabase db dump > backup.sql

# Restore data (if needed)
psql <connection_string> < backup.sql
```

---

## Troubleshooting

### Common Issues

#### Chat Not Responding
**Symptoms**: Messages send but no response

**Solutions**:
1. Check OpenAI API key validity
2. Verify Supabase connection
3. Check browser console for errors
4. Test Edge function directly

#### Voice Feature Not Working
**Symptoms**: Microphone button doesn't work

**Solutions**:
1. Check browser compatibility (use Chrome)
2. Verify microphone permissions
3. Test in different browser
4. Check HTTPS (required for microphone)

#### Admin Upload Fails
**Symptoms**: Documents stuck in "processing"

**Solutions**:
1. Check file format compatibility
2. Verify file is not corrupted
3. Check Supabase storage limits
4. Review error message in dashboard
5. Check OpenAI API rate limits

#### Authentication Issues
**Symptoms**: Can't login or signup

**Solutions**:
1. Verify email format
2. Check password requirements
3. Clear browser cache/cookies
4. Check Supabase auth settings
5. Verify email confirmation (if enabled)

### Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| AUTH_001 | Invalid credentials | Check email/password |
| KB_002 | Search failed | Check database connection |
| AI_003 | OpenAI API error | Verify API key and quota |
| UPLOAD_004 | File processing failed | Check file format and size |
| VOICE_005 | Microphone access denied | Grant browser permissions |

### Getting Help

For technical support:
1. Check this documentation
2. Review browser console errors
3. Check Supabase logs
4. Contact development team

---

## Future Enhancements

### Planned Features (Milestone 4+)
- WhatsApp integration
- Mobile app (React Native)
- Offline mode
- Photo recognition (AI identifies locations)
- AR features for historical sites
- Booking integration (hotels, tours)
- Social features (share experiences)
- Multi-modal AI (image + text)

### Potential Improvements
- Better mobile responsiveness
- Progressive Web App (PWA)
- Push notifications
- Multi-user conversations
- Admin analytics dashboard
- Automated content updates
- Integration with local business APIs

---

## Credits & License

### Technologies Used
- React 18 + TypeScript
- Supabase (PostgreSQL + Edge Functions)
- OpenAI GPT-4
- Tailwind CSS
- Lucide Icons
- Web Speech API

### Developed For
Muro Lucano Tourism Board

### Version
Milestone 3 - Voice Chat Integration
Last Updated: 2025

---

**For additional questions or support, please contact the development team.**
