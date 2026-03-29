# VibeCam - Task Breakdown

This document outlines the strict checklist of tasks to complete VibeCam v1 (Browser-Native, No-Backend). We will adhere to this list strictly to prevent scope creep.

## Phase 1: Foundation & Setup
- [x] Initialize Next.js 14 project (App Router)
- [x] Install and configure Tailwind CSS v4
- [x] Install Zustand for global state management
- [x] Configure `next/font/google` for Syne and Geist Mono
- [x] Define CSS variables and animation keyframes in `globals.css`
- [x] Create Zustand store (`useAppStore.ts`) for recording lifecycle, options, and share state

## Phase 2: Core Utilities
- [x] Implement `useStorage.ts` to interact with IndexedDB (idb-keyval)
- [x] Implement `useRecorder.ts` representing Media API interactions (`getDisplayMedia`, `getUserMedia`)
- [x] Implement `useAudioMixer.ts` for mixing System Audio & Microphone inputs using `AudioContext`
- [x] Implement helper utilities (`format.ts`) for time formatting

## Phase 3: UI Components
- [x] Create basic Layout (`layout.tsx`) and global styling wrapper
- [x] Build `Header.tsx` (Logo + blinking dot)
- [x] Build `IdleScreen.tsx` (Hero, start recording CTA, audio/mic toggles)
- [x] Build `RecordingScreen.tsx` (Live preview, red recording indicator, stop button)
- [x] Build `EditorScreen.tsx` (Video playback, trim timeline controls)
- [x] Build `TrimTimeline.tsx` (Draggable handles, progress tracking)
- [x] Build `ShareModal.tsx` (Read-only link, "copy link" functionality)
- [x] Build `WatchScreen.tsx` (Public playback view mapping to `#watch:id`)

## Phase 4: Integration
- [x] Integrate recording API with Idle & Recording screens
- [x] Integrate stop logic naturally, upon tab close, and upon "ESC" shortcut
- [x] Wire up saved recordings to IndexedDB, including trim start and end parameters
- [x] Implement routing/hash logic allowing browser hash strings to trigger WatchScreen fetching

## Phase 5: Polish & Testing
- [x] Ensure ObjectURLs are revoked properly on unmount
- [x] Test graceful error messages on unsupported browsers or rejected permissions
- [x] Validate 16:9 constraints and responsive sizing logic
- [x] Verify maximum bundle size is healthy and performance stays 60FPS
- [x] Final UI/UX review matching Token Design guidelines

## Phase 6: Supabase Integration
- [x] Create `.env.local` and configure `lib/supabase.ts`
- [x] Update database schema with new metadata columns (`trim_start`, `trim_end`, `mime_type`, etc)
- [x] Refactor `hooks/useStorage.ts` to upload explicitly to cloud bucket instead of auto IDB save
- [x] Update `EditorScreen.tsx` to handle async upload button state and spinner
- [x] Update `WatchScreen.tsx` to pull database metadata and load stream directly from Cloud URL

## Phase 7: Camera Compositing (Loom-style)
- [x] Composite webcam into screen recording via canvas (not just a visual overlay)
- [x] Use `setInterval` draw loop so webcam keeps recording when tab is backgrounded
- [x] Add camera position selector (top-left, top-right, bottom-left, bottom-right) to store
- [x] Add position picker UI on IdleScreen when camera is toggled ON
- [x] Remove all native `alert()` popups, errors log to console only

## Phase 8: UI Polish & Attribution
- [x] Add "Built by Himanshu Sah - LinkedIn" attribution on IdleScreen
- [x] Update README.md with full project documentation
- [x] Update progress.md and tasks.md to reflect all completed work

## Phase 9: User Authentication & My Recordings
- [x] Create `supabase_auth_setup.sql` migration (user_id column, RLS policies)
- [x] Create `context/AuthProvider.tsx` with Supabase Auth session management
- [x] Create `/auth/login` page (email + password sign-in)
- [x] Create `/auth/register` page (sign-up with password strength indicator)
- [x] Create `/dashboard` page (My Recordings grid with video preview, copy link, delete)
- [x] Update `app/layout.tsx` to wrap with AuthProvider
- [x] Update `components/Header.tsx` with auth state (Sign In / avatar dropdown)
- [x] Update `hooks/useStorage.ts` to include `user_id` on upload
- [x] Update `components/EditorScreen.tsx` to gate upload on authentication
- [x] Build passes successfully with all new routes
