# VibeCam — Premium Features Roadmap

These features are planned for future implementation. Implementation plans and technical details are documented here for reference.

---

## Feature: Enhanced Video Editor & Watermark

**Priority:** High  
**Status:** Planned  
**Phase:** 10

### Overview

Upgrade the current basic head/tail trim editor to a full multi-segment clipping system with watermark support.

### Features

#### 1. Multi-Segment Clipping
- **Split at playhead** — click scissors icon to add a cut point at the current position
- **Delete segments** — remove any section from the middle of the video
- **Undo split** — revert the last cut
- **Fine-tune handles** — drag edges of each segment for precise cuts
- Segments model: array of `{ start: number, end: number }` ratios replacing the current `trimStart`/`trimEnd`

#### 2. Rich Timeline (EditTimeline)
- Visual segment blocks with filled sections (kept) and dark gaps (cut)
- Per-segment delete buttons (✕ on hover)
- Draggable handles on segment edges
- Playhead scrubbing
- Time labels at regular intervals
- Professional editing feel (DaVinci/CapCut style)

#### 3. Text Watermark
- Toggle-able watermark overlay
- Custom text input (default: "CONFIDENTIAL")
- 9-position grid picker (TL, TC, TR, ML, MC, MR, BL, BC, BR)
- Opacity slider (10%–80%)
- Size selector (Small / Medium / Large)
- Live preview on the video player

#### 4. Canvas Re-encoding
- When exporting (upload/download), video is processed through a Canvas
- Only kept segments are included, watermark is baked in
- Uses `canvas.captureStream()` → `MediaRecorder` for final WebM output
- Audio stays in sync via extracted audio track
- Processing progress bar (~1× realtime)

### Technical Implementation

#### Files to Create
| File | Purpose |
|------|---------|
| `components/EditTimeline.tsx` | Rich segment-based timeline (replaces TrimTimeline) |
| `components/WatermarkControls.tsx` | Watermark config panel (text, position, opacity, size) |
| `lib/videoProcessor.ts` | Canvas re-encoding engine (segments + watermark → final blob) |
| `supabase_editor_setup.sql` | Add `segments JSONB` and `has_watermark BOOLEAN` columns |

#### Files to Modify
| File | Change |
|------|--------|
| `store/useAppStore.ts` | Replace `trimStart`/`trimEnd` with `segments[]` array + split/delete/undo actions |
| `components/EditorScreen.tsx` | New toolbar (Split, Undo, Delete), EditTimeline, WatermarkControls, processing overlay |
| `hooks/useStorage.ts` | Accept processed blob, store segment data |
| `components/WatchScreen.tsx` | Remove trim boundary enforcement (video is pre-cut) |

#### Store Model Change
```typescript
type Segment = { start: number; end: number };

// New store fields:
segments: Segment[];
setSegments: (segments: Segment[]) => void;
splitAtPlayhead: (ratio: number) => void;
deleteSegment: (index: number) => void;
undoSplit: () => void;
```

#### Processing Flow
```
User clicks Upload/Download
  → Has cuts or watermark?
    → No: use original blob directly
    → Yes: show processing overlay
      → Canvas re-encode loop
      → Play each segment → draw frame + watermark → record
      → Progress bar: segment X of Y
      → MediaRecorder produces final blob
      → Upload or Download the processed blob
```

#### Database Migration
```sql
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS segments JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS has_watermark BOOLEAN DEFAULT false;
```

### UI Layout Reference

```
┌──────────────────────────────────────────────────────┐
│  ┌─ Editing Toolbar ─────────────────────────────┐   │
│  │ ✂️ Split  │ ↩️ Undo  │ 🗑️ Delete Segment       │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌─ Timeline ────────────────────────────────────┐   │
│  │ [███████]  ░░░░  [████████████]  ░░░  [█████] │   │
│  │ 0:00    0:12  0:18        0:35  0:40    0:52  │   │
│  │              ▼ playhead                        │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ▶ Watermark Settings                                │
│    ┌─────────────────────────────────────┐           │
│    │ Text: [CONFIDENTIAL        ]       │           │
│    │ Position: [● . .]  Opacity: 40%    │           │
│    │ Size: [Sm] [Md] [Lg]               │           │
│    └─────────────────────────────────────┘           │
└──────────────────────────────────────────────────────┘
```

### Open Design Decisions
1. **Re-encoding duration**: ~1× realtime (30s video → ~30s to export). Alternative: metadata-only cuts (instant but raw video uploaded)
2. **Watermark type**: Text-only vs. also image/logo upload support
3. **Max segments**: Suggest 20 segment cap for UI manageability

---

*This document will be updated as more premium features are planned.*
