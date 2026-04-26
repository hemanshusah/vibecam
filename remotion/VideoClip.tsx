// ============================================
// VibeCam V2 — Single Video Clip Renderer
// ============================================

import { AbsoluteFill, Video } from 'remotion';
import type { VideoClip as VideoClipType } from '@/lib/remotion-types';

type Props = Omit<VideoClipType, 'id' | 'startFrame' | 'durationInFrames'>;

export const VideoClipComponent: React.FC<Props> = ({
  src,
  trimFrom,
  speed = 1,
  volume = 1,
}) => {

  return (
    <AbsoluteFill>
      <Video
        src={src}
        startFrom={trimFrom}
        playbackRate={speed}
        volume={volume}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </AbsoluteFill>
  );
};
