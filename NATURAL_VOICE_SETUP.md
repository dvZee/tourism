# Natural Voice Setup Guide (OpenAI TTS)

## Overview

Your app now supports **natural, human-like voices** using OpenAI's Text-to-Speech API instead of the robotic browser voices.

### Voice Quality Comparison:

| Feature | Browser Voice | OpenAI TTS |
|---------|--------------|------------|
| Quality | ⭐⭐ Robotic | ⭐⭐⭐⭐⭐ Human-like |
| Naturalness | Mechanical | Very natural |
| Emotion | None | Expressive |
| Languages | Limited | Excellent |
| Cost | Free | ~$15 per 1M chars |
| Setup | None | API key needed |

## Setup Instructions

### Step 1: Deploy the Edge Function

The Edge Function is already created at `supabase/functions/text-to-speech/index.ts`

Deploy it:

```bash
# Login to Supabase CLI (if not already)
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy text-to-speech
```

### Step 2: Set OpenAI API Key

You need to add your OpenAI API key to Supabase:

```bash
# Set the secret
supabase secrets set OPENAI_API_KEY=sk-your-openai-api-key-here
```

Or via Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Edge Functions**
4. Click **"Manage secrets"**
5. Add secret: `OPENAI_API_KEY` = `sk-...`

### Step 3: Get OpenAI API Key

If you don't have one:

1. Go to https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Copy the key (starts with `sk-...`)
4. Add it to Supabase (Step 2)

### Step 4: Test the Function

```bash
# Test locally
supabase functions serve text-to-speech

# In another terminal, test it:
curl -i --location --request POST 'http://localhost:54321/functions/v1/text-to-speech' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"text":"Ciao, come stai?","language":"it"}'
```

## How It Works

### Architecture:

```
User speaks → Speech Recognition (Browser)
     ↓
AI processes question
     ↓
AI generates response text
     ↓
Text → Supabase Edge Function → OpenAI TTS API
     ↓
Audio file (MP3) ← Returns
     ↓
Browser plays audio → User hears natural voice
```

### Voice Selection:

The app automatically selects the best voice for each language:

```typescript
const voiceMap = {
  "it": "alloy",    // Italian - warm, friendly
  "en": "nova",     // English - natural, conversational
  "es": "shimmer",  // Spanish - warm, expressive
};
```

### Available OpenAI Voices:

1. **alloy** - Neutral, balanced (default for Italian)
2. **echo** - Male, clear
3. **fable** - British accent, expressive
4. **onyx** - Deep, authoritative
5. **nova** - Warm, conversational (default for English)
6. **shimmer** - Soft, gentle (default for Spanish)

## Usage

### In the App:

1. **Enable Voice Mode**: Tap the green microphone button
2. **Toggle Natural Voice**: Check the "Natural AI Voice (OpenAI)" checkbox
3. **Speak**: Ask your question
4. **Listen**: Hear the natural AI response

### Toggle Between Voices:

Users can switch between:
- ✅ **Natural AI Voice** (OpenAI TTS) - Human-like
- ⚠️ **Browser Voice** (Speech Synthesis) - Robotic (fallback)

## Cost Estimation

### OpenAI TTS Pricing:
- **tts-1**: $15.00 per 1M characters
- **tts-1-hd**: $30.00 per 1M characters (higher quality)

### Example Costs:

| Usage | Characters | Cost (tts-1) |
|-------|-----------|--------------|
| 100 responses (avg 200 chars) | 20,000 | $0.30 |
| 1,000 responses | 200,000 | $3.00 |
| 10,000 responses | 2,000,000 | $30.00 |

### Monthly Estimates:

- **Light use** (100 voice responses/day): ~$9/month
- **Medium use** (500 voice responses/day): ~$45/month
- **Heavy use** (2000 voice responses/day): ~$180/month

## Configuration Options

### Change Voice Model:

Edit `supabase/functions/text-to-speech/index.ts`:

```typescript
// For higher quality (2x cost)
model: "tts-1-hd"

// For faster/cheaper
model: "tts-1"
```

### Change Voice:

```typescript
const voiceMap: Record<string, string> = {
  "it": "nova",     // Change Italian voice
  "en": "alloy",    // Change English voice
  "es": "fable",    // Change Spanish voice
};
```

### Adjust Speed:

```typescript
body: JSON.stringify({
  model: "tts-1",
  input: text,
  voice: voice,
  speed: 1.1,  // 0.25 to 4.0 (1.0 = normal)
}),
```

## Fallback Behavior

The app automatically falls back to browser voice if:
- OpenAI API is unavailable
- API key is missing
- Network error occurs
- Audio playback fails

This ensures voice mode always works!

## Testing Checklist

### Local Testing:
- [ ] Deploy Edge Function
- [ ] Set OpenAI API key
- [ ] Test function with curl
- [ ] Check function logs

### App Testing:
- [ ] Enable voice mode
- [ ] Check "Natural AI Voice" checkbox
- [ ] Speak a question in Italian
- [ ] Verify natural voice response
- [ ] Test in English
- [ ] Test in Spanish
- [ ] Try unchecking (browser voice)
- [ ] Verify fallback works

### Quality Testing:
- [ ] Voice sounds natural
- [ ] No robotic tone
- [ ] Clear pronunciation
- [ ] Appropriate speed
- [ ] Good emotion/expression
- [ ] No audio glitches

## Troubleshooting

### Issue: "OpenAI TTS error"

**Causes:**
- API key not set
- Invalid API key
- OpenAI API down
- Rate limit exceeded

**Solutions:**
1. Check API key in Supabase secrets
2. Verify key is valid on OpenAI dashboard
3. Check OpenAI status page
4. Check usage limits

### Issue: Falls back to browser voice

**Causes:**
- Edge Function not deployed
- Network error
- CORS issue

**Solutions:**
1. Deploy function: `supabase functions deploy text-to-speech`
2. Check network connection
3. Check browser console for errors

### Issue: Audio doesn't play

**Causes:**
- Browser autoplay policy
- Audio format not supported
- iOS restrictions

**Solutions:**
1. User must interact first (tap button)
2. Check browser compatibility
3. Test on different devices

### Issue: Voice is too fast/slow

**Solution:**
Adjust speed in Edge Function:
```typescript
speed: 0.9  // Slower
speed: 1.2  // Faster
```

## Monitoring

### Check Usage:

1. **OpenAI Dashboard**: https://platform.openai.com/usage
   - View API usage
   - Check costs
   - Monitor rate limits

2. **Supabase Logs**:
   ```bash
   supabase functions logs text-to-speech
   ```

3. **Browser Console**:
   - Check for errors
   - Monitor API calls
   - Debug issues

## Alternative Solutions

If OpenAI TTS doesn't meet your needs:

### 1. ElevenLabs (Best Quality)
- **Pros**: Most natural, emotional voices
- **Cons**: More expensive (~$5-$22/month)
- **Setup**: Similar to OpenAI

### 2. Google Cloud TTS
- **Pros**: WaveNet voices, good Italian
- **Cons**: More complex setup
- **Cost**: ~$16 per 1M characters

### 3. Azure Speech Services
- **Pros**: Neural voices, good quality
- **Cons**: Microsoft account needed
- **Cost**: Similar to Google

### 4. Amazon Polly
- **Pros**: Neural voices, AWS integration
- **Cons**: AWS setup required
- **Cost**: $16 per 1M characters

## Comparison Table

| Service | Quality | Italian | Cost | Setup |
|---------|---------|---------|------|-------|
| OpenAI TTS | ⭐⭐⭐⭐⭐ | Excellent | $15/1M | Easy |
| ElevenLabs | ⭐⭐⭐⭐⭐ | Excellent | $5-22/mo | Easy |
| Google TTS | ⭐⭐⭐⭐ | Excellent | $16/1M | Medium |
| Azure | ⭐⭐⭐⭐ | Good | $16/1M | Medium |
| Amazon Polly | ⭐⭐⭐⭐ | Good | $16/1M | Medium |
| Browser | ⭐⭐ | Poor | Free | None |

## Recommendation

**For your use case (Italian tourism app):**

✅ **Start with OpenAI TTS**
- Easy integration (already done!)
- Good quality
- Reasonable cost
- Reliable

🎯 **Upgrade to ElevenLabs if:**
- Need even more natural voices
- Want emotional expression
- Budget allows

## Next Steps

1. **Deploy the Edge Function**
   ```bash
   supabase functions deploy text-to-speech
   ```

2. **Set API Key**
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-...
   ```

3. **Test in App**
   - Enable voice mode
   - Check "Natural AI Voice"
   - Test with Italian questions

4. **Monitor Usage**
   - Check OpenAI dashboard
   - Monitor costs
   - Adjust as needed

5. **Optimize**
   - Choose best voice for each language
   - Adjust speed if needed
   - Consider tts-1-hd for higher quality

## Support

- **OpenAI Docs**: https://platform.openai.com/docs/guides/text-to-speech
- **Supabase Docs**: https://supabase.com/docs/guides/functions
- **Voice Samples**: https://platform.openai.com/docs/guides/text-to-speech/voice-options

---

**Status**: Ready to deploy
**Estimated Setup Time**: 10 minutes
**Estimated Cost**: $9-45/month (depending on usage)
