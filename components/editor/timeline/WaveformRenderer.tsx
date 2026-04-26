"use client";

// ============================================
// VibeCam V2 — Waveform SVG Renderer
// ============================================

import React from 'react';

type WaveformRendererProps = {
  peaks: number[];
  width: number;
  height: number;
  colour?: string;
  opacity?: number;
};

const WaveformRendererComponent: React.FC<WaveformRendererProps> = ({
  peaks,
  width,
  height,
  colour = '#E8FF47',
  opacity = 0.5,
}) => {
  if (peaks.length === 0) return null;

  const barWidth = Math.max(1, width / peaks.length);
  const halfHeight = height / 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0"
      preserveAspectRatio="none"
    >
      {peaks.map((peak, i) => {
        const barHeight = Math.max(1, peak * halfHeight * 0.9);
        const x = i * barWidth;

        return (
          <g key={i} opacity={opacity}>
            {/* Upper half */}
            <rect
              x={x}
              y={halfHeight - barHeight}
              width={Math.max(0.5, barWidth - 0.5)}
              height={barHeight}
              fill={colour}
              rx={0.5}
            />
            {/* Lower half (mirror) */}
            <rect
              x={x}
              y={halfHeight}
              width={Math.max(0.5, barWidth - 0.5)}
              height={barHeight}
              fill={colour}
              rx={0.5}
            />
          </g>
        );
      })}
    </svg>
  );
};

export const WaveformRenderer = React.memo(WaveformRendererComponent);
