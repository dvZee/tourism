# Deploy Natural Voice - Step by Step

## Your Situation
✅ You already have OpenAI API key (same one works for voice!)
❌ Need to deploy the Edge Function

## Option 1: Deploy via Supabase Dashboard (Easiest - 5 minutes)

### Step 1: Install Supabase CLI

Open Terminal and run:
```bash
# Install with npm (you may need sudo)
sudo npm install -g supabase

# Or download directly from:
# https://github.com/supabase/cli/releases
```

### Step 2: Login to Supabase
```bash
supabase login
```
This will open a browser - login with your Supabase account.

### Step 3: Link Your Project
```bash
# Get your project ref from Supabase dashboard URL:
# https://supabase.com/dashboard/project/YOUR_PROJECT_REF

supabase link --project-ref YOUR_PROJECT_REF
```

### Step 4: Deploy the Function
```bash
supabase functions deploy text-to-speech
```

### Step 5: Set Your OpenAI API Key
```bash
# Use your EXISTING OpenAI API key
supabase secrets set OPENAI_API_KEY=sk-your-existing-key-here
```

### Step 6: Test It
Open your app, enable voice mode, check "Natural AI Voice" - done!

---

## Option 2: Manual Deploy via Supabase Dashboard (No CLI needed)

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project
3. Go to **Edge Functions** (left sidebar)

### Step 2: Create New Function
1. Click **"Create a new function"**
2. Name it: `text-to-speech`
3. Copy the code from `supabase/functions/text-to-speech/index.ts`
4. Paste it in the editor
5. Click **"Deploy"**

### Step 3: Set Environment Variable
1. In Edge Functions page, click **"Manage secrets"**
2. Add new secret:
   - Key: `OPENAI_API_KEY`
   - Value: Your existing OpenAI API key (starts with `sk-...`)
3. Save

### Step 4: Test
1. Open your app
2. Enable voice mode
3. Check "Natural AI Voice (OpenAI)"
4. Speak - should hear natural voice!

---

## Option 3: I'll Help You Deploy

If you want, I can help you deploy using the CLI. Just tell me:
1. Your Supabase project ref (from dashboard URL)
2. Your OpenAI API key

And I'll guide you through each command.

---

## Quick Check: Do You Have These?

- [ ] Supabase account
- [ ] Supabase project created
- [ ] OpenAI API key (same one you use for chat)
- [ ] Terminal access

---

## The Code to Deploy

The Edge Function code is already in your project at:
`supabase/functions/text-to-speech/index.ts`

It's a simple function that:
1. Receives text from your app
2. Sends it to OpenAI TTS API
3. Returns audio file
4. Your app plays it

---

## After Deployment

### Test in Browser Console:
```javascript
// Open your app
// Open browser console (F12)
// Run this:

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

console.log('Response:', response.status);
// Should see: 200
```

---

## Troubleshooting

### Can't install Supabase CLI?
**Solution**: Use Option 2 (Manual Deploy via Dashboard)

### "Permission denied" when installing?
**Solution**: 
```bash
sudo npm install -g supabase
```

### Don't have Homebrew?
**Solution**: Use npm method or manual dashboard method

### Function not working?
**Solution**: 
1. Check OpenAI API key is set correctly
2. Check function logs in Supabase dashboard
3. Verify API key has credits

---

## Cost Reminder

Using your existing OpenAI API key:
- Chat: ~$0.002 per 1K tokens
- Voice: ~$0.015 per 1K characters

Both use the same billing account!

---

## What Happens Next?

Once deployed:
1. ✅ Voice mode will use natural AI voice
2. ✅ Users can toggle between natural/browser voice
3. ✅ Automatic fallback if API fails
4. ✅ Same OpenAI account, same billing

---

## Need Help?

Tell me which option you want to try:
1. **Option 1**: Install CLI and deploy (I'll guide you)
2. **Option 2**: Manual dashboard deploy (I'll give you the code)
3. **Option 3**: You do it yourself later

Which one? 😊
