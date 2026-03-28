# VibeCam

**Browser-native screen recorder — like Loom, but with zero friction.**

Open the URL, hit Record, trim your clip, get a shareable link. No sign-up, no app install. Built entirely in the browser using native Web APIs + Supabase cloud storage.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Recording | MediaRecorder + getDisplayMedia |
| Audio | Web AudioContext (mic + system audio mixing) |
| Storage | Supabase (Storage bucket + PostgreSQL) |
| Hosting | Vercel |
| Fonts | Syne + JetBrains Mono (Google Fonts) |

## Features

- **Screen Recording** — Capture your entire screen, a window, or a tab
- **Microphone Audio** — Toggle mic on/off, mixed with system audio
- **Webcam Compositing** — Face camera baked into the recording as a circle overlay (Loom-style), with adjustable position (TL/TR/BL/BR)
- **Trim Editor** — Non-destructive trim with draggable handles and live preview
- **Cloud Sharing** — Upload & Share via Supabase; anyone with the link can watch
- **Pause / Resume** — Pause and resume your recording mid-session
- **Keyboard Shortcuts** — ESC to stop recording

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key
```

### 3. Set up Supabase database

Run the contents of `supabase_setup.sql` in your Supabase project's SQL Editor. This creates the `videos` table and `recordings` storage bucket with appropriate RLS policies.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
vibecam/
├── app/
│   ├── page.tsx              ← Main app (Idle, Record, Edit screens)
│   ├── layout.tsx            ← Root layout, font imports
│   └── globals.css           ← CSS variables, base styles
├── components/
│   ├── IdleScreen.tsx        ← Hero + record button + toggles + cam position
│   ├── RecordingScreen.tsx   ← Live preview + stop/pause buttons
│   ├── EditorScreen.tsx      ← Video player + trim panel + upload
│   ├── WatchScreen.tsx       ← Cloud viewer for shared recordings
│   ├── TrimTimeline.tsx      ← Drag handles + playhead
│   ├── ShareModal.tsx        ← Link copy modal
│   ├── CameraBubble.tsx      ← Live camera preview overlay
│   └── Header.tsx            ← Logo + status dot
├── hooks/
│   ├── useRecorder.ts        ← MediaRecorder + canvas webcam compositing
│   ├── useAudioMixer.ts      ← AudioContext mic+system mix
│   └── useStorage.ts         ← Supabase upload + fetch
├── store/
│   └── useAppStore.ts        ← Zustand global state
├── lib/
│   ├── supabase.ts           ← Supabase client instance
│   └── format.ts             ← Time formatting helpers
├── supabase_setup.sql        ← Database + storage bucket setup
└── .env.local                ← Supabase credentials (gitignored)
```

## Deploy on Vercel

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` in Vercel → Settings → Environment Variables
4. Deploy

## Built By

[Himanshu Sah](https://linkedin.com/in/himanshusah)
