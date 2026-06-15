# 🎙️ VoiceScribe — Real-time Transcription App

A **Next.js 15** application with **Nhost authentication** and **Deepgram real-time transcription**. Speak into your microphone and watch your words appear live on screen.

---

## ✨ Features

- 🔐 **Nhost Auth** — Email/password signup & login with protected routes
- 🎤 **Real-time Transcription** — Deepgram Nova-2 model via WebSocket
- 📊 **Live Audio Visualizer** — Animated waveform that reacts to your voice
- 🌊 **Interim Results** — Words appear as you speak (not just after pauses)
- 📋 **Copy Transcript** — One-click copy of the full transcript
- 🔒 **Secure API Key Handling** — Deepgram key is never exposed to the browser

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth | Nhost (@nhost/nextjs) |
| Transcription | Deepgram Nova-2 (WebSocket) |
| Styling | CSS custom properties + Tailwind |
| Language | TypeScript |

---

## 🚀 Setup Instructions

### Step 1 — Install dependencies

```bash
npm install
```

### Step 2 — Set up Nhost

1. Go to https://app.nhost.io and create a free project
2. Find your Subdomain and Region on the project dashboard
3. Under Settings → Authentication, enable Email + Password sign-in

### Step 3 — Set up Deepgram

1. Go to https://console.deepgram.com and create a free account
2. Create a new API Key with Usage permissions

### Step 4 — Configure environment variables

```bash
cp .env.example .env.local
```

Edit .env.local:

```
NEXT_PUBLIC_NHOST_SUBDOMAIN=your-project-subdomain
NEXT_PUBLIC_NHOST_REGION=eu-central-1
DEEPGRAM_API_KEY=your-deepgram-api-key
```

### Step 5 — Run

```bash
npm run dev
```

Open http://localhost:3000

---

## 📁 Project Structure

```
voicescribe/
├── app/
│   ├── api/deepgram-token/route.ts   # Server: issues temporary Deepgram keys
│   ├── dashboard/page.tsx            # Protected dashboard + transcription UI
│   ├── login/page.tsx                # Login page
│   ├── signup/page.tsx               # Signup page
│   ├── globals.css                   # Global styles & animations
│   ├── layout.tsx                    # Root layout (NhostProvider wrapper)
│   └── page.tsx                      # Landing page
├── components/
│   ├── audio-visualizer.tsx          # Real-time waveform bars
│   ├── auth-form.tsx                 # Shared login/signup form
│   ├── providers.tsx                 # NhostProvider client wrapper
│   └── transcript-display.tsx        # Scrollable transcript display
├── lib/
│   ├── nhost.ts                      # Nhost client singleton
│   └── use-deepgram-transcription.ts # Recording + WebSocket hook
├── .env.example
└── next.config.ts
```

---

## 🔑 API Key Security

The Deepgram key never reaches the browser. The /api/deepgram-token route
issues a temporary key (expires in 10 seconds) via Deepgram's Project API.
The browser uses this throwaway key to open the WebSocket connection only.

---

## 🌐 Deploy to Vercel

```bash
npx vercel
```

Add environment variables in Project → Settings → Environment Variables.

---

## 🛠️ Troubleshooting

- "Microphone access denied": Allow mic access in your browser's address bar
- "Deepgram API key not configured": Check .env.local has DEEPGRAM_API_KEY set  
- Blank page after login: Verify NEXT_PUBLIC_NHOST_SUBDOMAIN and REGION are correct
- Email verification required: Disable it in Nhost auth settings for development
