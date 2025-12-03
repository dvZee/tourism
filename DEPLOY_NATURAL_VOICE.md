# Quick Deploy: Natural Voice

## What You Need

1. OpenAI API Key
2. Supabase CLI installed
3. 10 minutes

## Step-by-Step Deployment

### 1. Get OpenAI API Key (2 minutes)

```bash
# Go to: https://platform.openai.com/api-keys
# Click "Create new secret key"
# Copy the key (starts with sk-...)
```

### 2. Deploy Edge Function (3 minutes)

```bash
# Make sure you're in the project directory
cd /path/to/your/project

# Login to Supabase (if not already)
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the text-to-speech function
supabase functions deploy text-to-speech

# Set the OpenAI API key
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

### 3. Test It (2 minutes)

```bash
# Get your anon key from Supabase dashboard
# Settings > API > anon public key

# Test the function
curl -i --location --request POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/text-to-speech' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"text":"Ciao, come stai?","language":"it"}'

# Should return audio data
```

### 4. Deploy App (3 minutes)

```bash
# Build the app
npm run build

# Deploy to your hosting (Vercel/Netlify/etc)
# The app is already pushed to GitHub, so:
# - Vercel will auto-deploy
# - Or manually deploy the dist folder
```

## Verify It Works

1. Open your app on iPhone
2. Tap the microphone button (voice mode)
3. Check the "Natural AI Voice (OpenAI)" checkbox
4. Speak a question in Italian
5. Listen - should sound natural, not robotic!

## Troubleshooting

### "OpenAI TTS error" in console

**Fix:**
```bash
# Check if secret is set
supabase secrets list

# If not there, set it again
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

### Function not found

**Fix:**
```bash
# Redeploy
supabase functions deploy text-to-speech

# Check deployment
supabase functions list
```

### Still sounds robotic

**Fix:**
- Make sure the checkbox "Natural AI Voice (OpenAI)" is checked
- Check browser console for errors
- Verify OpenAI API key is valid

## Cost Monitoring

Check usage at: https://platform.openai.com/usage

Expected costs:
- Light use: ~$9/month
- Medium use: ~$45/month

## Alternative: Use ElevenLabs Instead

If you want even better quality:

### 1. Sign up at https://elevenlabs.io
### 2. Get API key
### 3. Modify the Edge Function:

```typescript
// In supabase/functions/text-to-speech/index.ts
// Replace OpenAI call with ElevenLabs:

const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID`,
  {
    method: "POST",
    headers: {
      "xi-api-key": Deno.env.get("ELEVENLABS_API_KEY"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
    }),
  }
);
```

### 4. Set ElevenLabs key:
```bash
supabase secrets set ELEVENLABS_API_KEY=your-key
```

## Quick Commands Reference

```bash
# Deploy function
supabase functions deploy text-to-speech

# Set API key
supabase secrets set OPENAI_API_KEY=sk-...

# View logs
supabase functions logs text-to-speech

# List secrets
supabase secrets list

# Test locally
supabase functions serve text-to-speech
```

## Done!

Your app now has natural, human-like voice! 🎉

Users can toggle between:
- ✅ Natural AI Voice (OpenAI) - Human-like
- ⚠️ Browser Voice - Robotic (fallback)

---

**Need help?** Check `NATURAL_VOICE_SETUP.md` for detailed guide.
