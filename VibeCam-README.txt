VIBECAM
Product README & Build Specification
v1.0    No Login      Browser-Native      Zero Install  
For: Antigravity Engineering Team
TL;DR
VibeCam is a browser-based screen recorder — like Loom, but with zero friction. Open the URL, hit Record, trim your clip, get a shareable link. No sign-up, no app install, no backend required for v1. Built entirely in the browser using native Web APIs.

1. Product Overview
1.1 Problem Statement
Loom is powerful but gated behind sign-up, installs, and paywalls. Teams using quick async video face friction at every step. VibeCam removes all of it.

1.2 Value Proposition
Pain Point (Today)
VibeCam Solution
Loom requires account creation
Open URL — ready to record instantly
App install or Chrome extension needed
100% browser-native, no install
Paywalls limit video length or exports
Free, unlimited recordings in v1
Links require recipient to log in
Hash-based links — anyone can watch
Complex editing UI
One-slider trim, nothing else

1.3 Core User Journey
	•	User opens VibeCam URL in any modern browser
	•	Optionally toggles mic audio on/off
	•	Clicks "Start Recording" — browser asks for screen permission
	•	Records screen (with or without system audio + mic)
	•	Clicks "Stop" when done
	•	Trims start/end using the timeline handles
	•	Clicks "Share" — gets a copyable link instantly
	•	Shares link — recipient clicks, video plays immediately


2. Tech Stack & Architecture
2.1 Recommended Stack
Layer
Technology
Why
Framework
Next.js 14 (App Router)
Fast deploys, file-based routing, great DX
Styling
Tailwind CSS v4
Utility-first, consistent with design tokens
State
Zustand
Simple global state for recording lifecycle
Recording API
MediaRecorder + getDisplayMedia
Native browser API, no libs needed
Video Playback
Native <video> element
No overhead, full control
Storage (v1)
localStorage + IndexedDB
No backend needed, works offline
Storage (v2)
Cloudflare R2 + Workers
Real shareable URLs, global CDN
Hosting
Vercel
Zero-config, instant deploys, free tier
URL Sharing
URL hash (#watch:ID)
Works without a server in v1
Fonts
Syne + Geist Mono (Google Fonts)
Brand typography as specified in design

2.2 Architecture Diagram (v1 — No Backend)
Browser
  ├─ MediaRecorder API  →  captures screen stream
  ├─ AudioContext API   →  mixes mic + system audio
  ├─ Blob / ObjectURL   →  in-memory video data
  ├─ IndexedDB          →  persists recording locally
  └─ URL Hash Router    →  #watch:rec_1234 loads stored video

2.3 Architecture Diagram (v2 — With Backend)
Browser  →  Cloudflare Worker  →  R2 Bucket
              └─ Generates signed upload URL
              └─ Stores metadata in D1 (SQLite)
              └─ Returns short URL: vibecam.app/v/abc123


3. Screens & UI Specification
3.1 Design Language
Token
Value
Usage
--bg
#0A0A0B
Page background
--surface
#111113
Cards, panels
--border
#1E1E22
Dividers, outlines
--text
#F0F0F2
Primary text
--muted
#6B6B75
Secondary text, labels
--accent
#E8FF47
CTA buttons, active states, highlights
--red
#FF4545
Stop button, recording indicator
Font Display
Syne 700
Headlines, logo, CTAs
Font Mono
Geist Mono 400/500
Labels, timestamps, code
Border Radius
12px cards / 100px pills
Consistent roundness

3.2 Screen: Idle (Home)
	•	Full-bleed dark background with subtle noise texture overlay
	•	Centered hero: large headline + subtext in Geist Mono
	•	Single accent-colored "Start Recording" pill button
	•	Toggle options below button: Mic audio ON/OFF, Camera bubble ON/OFF
	•	Header: VibeCam logo (with animated dot) + "no login · no friction" tag
	•	No navigation, no sidebar — nothing to distract

3.3 Screen: Recording Active
	•	Red pulsing REC indicator pill at the top with live timer
	•	16:9 live preview of screen being recorded (muted)
	•	Large red "Stop Recording" square-icon button
	•	Keyboard shortcut: ESC or Cmd+Shift+X to stop
	•	If user closes the browser tab, recording auto-stops and saves

3.4 Screen: Editor
	•	"Edit & Share" heading with Discard and Share buttons top-right
	•	16:9 video player with native controls underneath
	•	TRIM panel below:
	•	Timeline track shows waveform or solid fill between trim handles
	•	Left handle: drag to set start point
	•	Right handle: drag to set end point
	•	Trim range label shows timestamps: e.g. "0:04 — 0:47"
	•	Playhead scrubs in real time during playback
	•	Play/Pause button + progress bar + current/total time
	•	Video respects trim bounds during preview playback
	•	Share button opens modal

3.5 Screen: Share Modal
	•	Dark overlay with blur behind modal
	•	Title: "Share recording"
	•	Read-only link input with "Copy link" button (turns green on copy)
	•	Note explaining local storage limitation for v1
	•	"Upgrade to VibeCam Pro" CTA placeholder for v2

3.6 Screen: Watch (Viewer)
	•	Loads from URL hash: vibecam.app/#watch:rec_1234
	•	Shows recording title + metadata (date, trimmed duration)
	•	"+ New Recording" button top-right to start fresh
	•	Full-width 16:9 player with native browser controls
	•	Plays trimmed segment only (respects trim start/end)
	•	Graceful error state if recording not found (link expired or different device)


4. Feature Specification
4.1 Recording Engine
Feature
Implementation
Notes
Screen capture
navigator.mediaDevices.getDisplayMedia()
Prompts browser permission dialog
System audio capture
audio: true in getDisplayMedia constraints
macOS: requires system extension; Windows: native
Microphone audio
getUserMedia({ audio: true })
Separate permission prompt
Audio mixing
Web AudioContext + createMediaStreamDestination()
Merges mic + system audio into one track
Camera bubble
getUserMedia({ video: true }) overlay
Draggable PiP circle, optional
Recording format
video/webm (vp9 + opus preferred)
Fallback chain: vp8, then base webm
Chunk size
250ms timeslice on MediaRecorder
Smooth data availability
Auto-stop
displayStream track "ended" event listener
Fires when user stops sharing in browser UI
Max duration
No hard limit in v1
Limited by browser memory / IndexedDB quota

4.2 Trim & Edit
Feature
Behaviour
Trim handles
Draggable left/right handles on a timeline track, touch + mouse support
Trim preview
Video.currentTime jumps to trim point on drag
Playback enforcement
Video pauses at trimEnd, skips to trimStart if seeked before it
Trim accuracy
Ratio-based (0–1 of total duration), applied on export/share
Destructive vs non-destructive
Non-destructive in v1 — original blob is preserved; trim is metadata only
Export trimming (v2)
FFmpeg.wasm client-side trim for real video file output

4.3 Storage & Sharing (v1 — Local)
	•	Video blob converted to base64 DataURL via FileReader
	•	Stored in localStorage with key: rec_{timestamp}
	•	Stored alongside trim metadata: { data, trimStart, trimEnd, date, duration }
	•	Share URL format: {origin}/#{hash}#watch:rec_{timestamp}
	•	Watch screen reads hash on load, retrieves from localStorage
	•	Limitation: link only works on same browser/device — clearly communicated in UI
	•	Size limit: ~5MB practical localStorage cap; recordings beyond this show a graceful error

4.4 Storage & Sharing (v2 — Cloud)
	•	User clicks Share — blob is uploaded to Cloudflare R2 via signed URL
	•	Worker saves metadata to D1: { id, r2Key, trimStart, trimEnd, createdAt, expiresAt }
	•	Short shareable URL returned: vibecam.app/v/abc123
	•	Watch page fetches metadata from API, streams from R2 CDN
	•	Optional: password-protect, set expiry (7 days / 30 days / never)
	•	Optional: view count + viewer list


5. Data Models
5.1 Recording Object (v1 — localStorage)
type Recording = {
  id:         string;    // "rec_1704067200000"
  data:       string;    // base64 DataURL of video blob
  mimeType:   string;    // "video/webm;codecs=vp9,opus"
  trimStart:  number;    // 0–1 ratio of total duration
  trimEnd:    number;    // 0–1 ratio of total duration
  duration:   number;    // total seconds (pre-trim)
  date:       string;    // ISO 8601 timestamp
  hasMic:     boolean;
  hasCamera:  boolean;
}

5.2 Recording Object (v2 — Cloudflare D1)
CREATE TABLE recordings (
  id          TEXT PRIMARY KEY,   -- nanoid short ID
  r2_key      TEXT NOT NULL,      -- path in R2 bucket
  mime_type   TEXT NOT NULL,
  duration    REAL NOT NULL,      -- seconds
  trim_start  REAL DEFAULT 0,
  trim_end    REAL DEFAULT 1,
  size_bytes  INTEGER,
  created_at  TEXT NOT NULL,
  expires_at  TEXT,               -- NULL = never expires
  view_count  INTEGER DEFAULT 0,
  password    TEXT                -- bcrypt hash, optional
);

5.3 App State (Zustand Store)
type AppStore = {
  // Recording lifecycle
  status: "idle" | "recording" | "stopped" | "editing" | "watching";

  // Active recording
  recordedBlob: Blob | null;
  recordedUrl:  string | null;   // ObjectURL
  recSeconds:   number;

  // Trim state
  trimStart: number;             // 0–1
  trimEnd:   number;             // 0–1

  // Options
  useMic:    boolean;
  useCamera: boolean;

  // Share
  shareUrl:  string | null;
  shareModalOpen: boolean;

  // Actions
  startRecording: () => Promise<void>;
  stopRecording:  () => void;
  setTrim: (start: number, end: number) => void;
  generateShareUrl: () => Promise<string>;
  discard: () => void;
}


6. Project File Structure
vibecam/
  ├─ app/
  │   ├─ page.tsx              ← Main app entry (Idle, Record, Edit screens)
  │   ├─ v/[id]/page.tsx       ← Watch/viewer screen
  │   ├─ layout.tsx            ← Root layout, font imports
  │   └─ globals.css           ← CSS variables, base styles
  ├─ components/
  │   ├─ IdleScreen.tsx        ← Hero + record button + toggles
  │   ├─ RecordingScreen.tsx   ← Live preview + stop button
  │   ├─ EditorScreen.tsx      ← Video player + trim panel
  │   ├─ WatchScreen.tsx       ← Viewer for shared recordings
  │   ├─ TrimTimeline.tsx      ← Drag handles + playhead
  │   ├─ ShareModal.tsx        ← Link copy modal
  │   ├─ CameraBubble.tsx      ← PiP camera overlay (optional)
  │   └─ Header.tsx            ← Logo + status dot
  ├─ hooks/
  │   ├─ useRecorder.ts        ← MediaRecorder logic
  │   ├─ useAudioMixer.ts      ← AudioContext mic+system mix
  │   ├─ useTrim.ts            ← Trim handle drag logic
  │   └─ useStorage.ts         ← localStorage / IndexedDB save+load
  ├─ store/
  │   └─ useAppStore.ts        ← Zustand global state
  ├─ lib/
  │   ├─ recorder.ts           ← Pure recording utilities
  │   ├─ storage.ts            ← Save/load to IndexedDB
  │   └─ format.ts             ← Time formatting helpers
  ├─ public/
  │   └─ favicon.svg           ← VibeCam logo mark
  └─ README.md


7. API Routes (v2 — Cloudflare Workers)
Method
Endpoint
Description
POST
/api/upload/init
Returns signed R2 upload URL + recording ID
PUT
/api/upload/:id/complete
Marks upload done, saves metadata to D1
GET
/api/recording/:id
Returns recording metadata (trimStart, trimEnd, CDN URL)
PATCH
/api/recording/:id
Update trim, expiry, password
DELETE
/api/recording/:id
Delete recording from R2 + D1
POST
/api/recording/:id/view
Increment view count

Upload Flow
	•	Client calls POST /api/upload/init — gets { id, uploadUrl }
	•	Client PUTs video blob directly to R2 signed URL
	•	Client calls PUT /api/upload/:id/complete with trim metadata
	•	Server saves to D1, returns shareable URL
	•	Client shows vibecam.app/v/{id} in share modal


8. Browser Compatibility
Browser
Screen Capture
System Audio
Notes
Chrome 94+
✅ Full
✅ Windows / partial macOS
Best experience. Recommended.
Edge 94+
✅ Full
✅ Windows
Chromium-based, same as Chrome
Firefox 113+
✅ Full
❌ Not supported
No system audio; mic only
Safari 16+
⚠️ Partial
❌ Not supported
Works but no audio capture
Mobile Chrome
❌ Not supported
❌ Not supported
getDisplayMedia not on mobile
Mobile Safari
❌ Not supported
❌ Not supported
Same limitation

Important: Show a graceful browser compatibility warning on unsupported browsers. Do not break silently.


9. Performance Requirements
	•	Time to first record: < 2 seconds from page load to recording start
	•	Share link generation: < 500ms (v1 local); < 3s (v2 upload)
	•	Trim handle drag: 60fps, no jank — use requestAnimationFrame
	•	Video playback: native <video> element, no custom renderer
	•	Bundle size: < 200KB gzipped — no heavy video libraries
	•	IndexedDB preferred over localStorage for recordings > 1MB
	•	Revoke ObjectURLs on unmount to prevent memory leaks
	•	Abort MediaRecorder and all streams on component unmount or route change


10. Build Phases
Phase 1 — Ship It (v1)
Feature
Priority
Notes
Screen recording (no audio)
P0
Core MVP
Screen recording + mic audio
P0
getUserMedia mix
Stop recording
P0
Stop button + auto-stop on share-end
Trim start/end
P0
Drag handles on timeline
Local share link (#watch:ID)
P0
localStorage + URL hash
Copy link to clipboard
P0
navigator.clipboard
System audio capture
P1
Chrome/Edge only
Camera bubble (PiP)
P1
Draggable overlay
Discard / re-record
P1
Clean state reset
Browser compatibility warning
P1
Graceful degradation

Phase 2 — Go Cloud (v2)
Feature
Priority
Notes
Cloud upload (R2)
P0
Real globally shareable links
Short URL: /v/{id}
P0
Replace hash routing
Video expiry settings
P1
7d / 30d / never
View counter
P1
Shown on watch screen
Password protection
P2
Optional link password
Custom title for recording
P2
Editable after recording
Download as MP4
P2
FFmpeg.wasm client-side
Reactions / emoji responses
P3
Viewer leaves emoji feedback
Chapters / timestamps
P3
Clickable markers on timeline


11. Critical Implementation Notes
For the Antigravity Team
	•	Always use IndexedDB (via idb-keyval or similar) instead of localStorage for video blobs. localStorage has a 5–10MB limit and can throw synchronously. IndexedDB is async and can handle hundreds of MB.
	•	Revoke all ObjectURLs using URL.revokeObjectURL() when navigating away from the editor. Failing to do this leaks memory proportional to recording size.
	•	The getDisplayMedia() call MUST be triggered directly by a user gesture (button click). Calling it programmatically (e.g. in a useEffect or after a delay) will be silently rejected by the browser.
	•	Handle the "ended" event on the video track from getDisplayMedia. This fires when the user clicks "Stop sharing" in the browser’s native UI. Without this handler, the MediaRecorder keeps running but records nothing.
	•	For audio mixing: create a single AudioContext, connect both mic and system audio sources to a MediaStreamDestination node. Pass the destination stream’s tracks into MediaRecorder alongside the video track.
	•	Test on macOS Chrome: system audio capture requires the user to enable "Share system audio" in the browser permission dialog. Do not assume it will always be available.
	•	The trim is non-destructive in v1 — store trimStart and trimEnd as ratios (0–1), not seconds. This keeps the model simple and format-agnostic.
	•	Keyboard shortcut ESC to stop recording is expected by users — wire this up early.
	•	Wrap the entire app in an error boundary. A failed MediaRecorder should show a friendly message, not a blank screen.


12. Design Assets & References
Fonts (import from Google Fonts)
import { Syne, Geist_Mono } from 'next/font/google';
const syne = Syne({ subsets: ['latin'], weight: ['400','500','600','700'] });
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['300','400','500'] });

CSS Variable Reference
:root {
  --bg:           #0A0A0B;
  --surface:      #111113;
  --border:       #1E1E22;
  --border-light: #2A2A2F;
  --text:         #F0F0F2;
  --muted:        #6B6B75;
  --accent:       #E8FF47;
  --accent-dim:   rgba(232, 255, 71, 0.12);
  --red:          #FF4545;
  --red-dim:      rgba(255, 69, 69, 0.15);
  --radius:       12px;
}

Animation Reference
/* Recording dot blink */
@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }

/* Logo dot pulse */
@keyframes pulse { 0%,100% { opacity:1; transform:scale(1) }
                   50%  { opacity:0.6; transform:scale(0.85) } }

/* Screen transitions */
@keyframes fadeIn { from { opacity:0; transform:translateY(6px) }
                     to  { opacity:1; transform:translateY(0) } }


13. Final Notes
The single most important principle for VibeCam: remove every step that isn’t recording or sharing. Every time you’re tempted to add a feature, ask whether it makes the core loop faster or slower. Speed wins.
Ship v1 as a single HTML file if needed. Add the backend in v2. Loom took years to get where it is — VibeCam can beat its day-one experience with a weekend build.
