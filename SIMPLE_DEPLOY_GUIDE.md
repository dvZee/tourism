# Simple Deploy Guide - Natural Voice

## Answer to Your Questions:

### Q: Do I need a different OpenAI API key for voice?
**A: NO!** Your existing OpenAI API key works for both:
- ✅ Chat (GPT-4, GPT-3.5)
- ✅ Voice (TTS)
- ✅ Same billing account

### Q: How to deploy Edge Function?
**A: Follow the steps below** ⬇️

---

## Easiest Method: Supabase Dashboard (No CLI needed!)

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard

### Step 2: Select Your Project
Click on your tourism project

### Step 3: Go to Edge Functions
- Click **"Edge Functions"** in the left sidebar
- Click **"Create a new function"**

### Step 4: Create the Function
1. **Function name**: `text-to-speech`
2. **Copy this code** (from your project file):

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, language = "it" } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Map language codes to OpenAI voice models
    const voiceMap: Record<string, string> = {
      "it": "alloy",    // Italian - warm, friendly
      "it-IT": "alloy",
      "en": "nova",     // English - natural, conversational
      "en-US": "nova",
      "es": "shimmer",  // Spanish - warm, expressive
      "es-ES": "shimmer",
    };

    const voice = voiceMap[language] || "alloy";

    // Call OpenAI TTS API
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voice,
        speed: 1.0,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI TTS error:", error);
      throw new Error(`OpenAI TTS failed: ${response.statusText}`);
    }

    // Get audio data as array buffer
    const audioData = await response.arrayBuffer();

    // Return audio file
    return new Response(audioData, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Content-Length": audioData.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Error in text-to-speech function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
```

3. Click **"Deploy function"**

### Step 5: Set Your OpenAI API Key
1. In the Edge Functions page, click **"Manage secrets"** or **"Settings"**
2. Add a new secret:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your existing OpenAI API key (the one you use for chat)
   - Example: `sk-proj-abc123...`
3. Click **"Save"**

### Step 6: Test It!
1. Open your app on iPhone
2. Tap the microphone button (voice mode)
3. You'll see a checkbox: **"Natural AI Voice (OpenAI)"**
4. Check it ✅
5. Speak a question in Italian
6. Listen - should sound natural and human-like! 🎉

---

## Alternative: Using CLI (If you prefer)

### Install Supabase CLI:
```bash
# Try this first:
npm install -g supabase

# If permission error, use:
sudo npm install -g supabase
```

### Deploy:
```bash
# Login
supabase login

# Link project (get YOUR_PROJECT_REF from dashboard URL)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy
supabase functions deploy text-to-speech

# Set API key (use your existing one)
supabase secrets set OPENAI_API_KEY=sk-your-existing-key
```

---

## How to Find Your Info

### Your Supabase Project Ref:
1. Go to Supabase dashboard
2. Look at the URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`
3. Copy the part after `/project/`

### Your OpenAI API Key:
1. You already have this (same one for chat)
2. It starts with `sk-proj-` or `sk-`
3. Find it in your .env file or OpenAI dashboard

---

## Verify It's Working

### In Browser Console:
1. Open your app
2. Press F12 (open console)
3. Run this test:

```javascript
// Replace YOUR_PROJECT_REF with your actual project ref
const response = await fetch(
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/text-to-speech',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ANON_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: 'Ciao, come stai?',
      language: 'it'
    })
  }
);

console.log('Status:', response.status); // Should be 200
```

---

## Troubleshooting

### "OpenAI API key not configured"
**Fix**: Make sure you set the secret in Supabase dashboard:
- Edge Functions > Manage secrets
- Add `OPENAI_API_KEY` with your key

### Still sounds robotic
**Fix**: Make sure the checkbox "Natural AI Voice (OpenAI)" is checked

### Function not found
**Fix**: 
1. Check function is deployed in Supabase dashboard
2. Check function name is exactly `text-to-speech`
3. Redeploy if needed

### Audio doesn't play
**Fix**:
1. Check browser console for errors
2. Verify OpenAI API key is valid
3. Check you have credits in OpenAI account

---

## Cost

Using your existing OpenAI account:
- **Chat**: $0.002 per 1K tokens (what you're already paying)
- **Voice**: $0.015 per 1K characters (new, but cheap)

**Example**: 
- 100 voice responses per day = ~$0.30/day = ~$9/month
- Same billing, same account!

---

## Summary

1. ✅ Use your **existing** OpenAI API key
2. ✅ Deploy via **Supabase Dashboard** (easiest)
3. ✅ Takes **5 minutes**
4. ✅ Natural voice instead of robotic!

---

## Need Help?

If you get stuck, tell me:
1. Which step you're on
2. Any error messages
3. Screenshot if helpful

I'll help you through it! 😊
