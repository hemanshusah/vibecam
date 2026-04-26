// ============================================
// VibeCam V2 — Shape Overlay (Remotion)
// ============================================

import { AbsoluteFill } from 'remotion';
import type { ShapeOverlayProps } from '@/lib/remotion-types';

export const ShapeOverlay: React.FC<ShapeOverlayProps> = ({
  shapeType,
  fillColour,
  strokeColour,
  strokeWidth,
  opacity,
  cornerRadius = 0,
  x,
  y,
  width,
  height,
  endX,
  endY,
}) => {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    width: `${width * 100}%`,
    height: `${height * 100}%`,
    opacity,
  };

  if (shapeType === 'rectangle') {
    return (
      <AbsoluteFill>
        <div
          style={{
            ...baseStyle,
            backgroundColor: fillColour,
            border: `${strokeWidth}px solid ${strokeColour}`,
            borderRadius: cornerRadius,
          }}
        />
      </AbsoluteFill>
    );
  }

  if (shapeType === 'circle') {
    return (
      <AbsoluteFill>
        <div
          style={{
            ...baseStyle,
            backgroundColor: fillColour,
            border: `${strokeWidth}px solid ${strokeColour}`,
            borderRadius: '50%',
          }}
        />
      </AbsoluteFill>
    );
  }

  if (shapeType === 'line' || shapeType === 'arrow') {
    const x1 = x * 100;
    const y1 = y * 100;
    const x2 = (endX ?? x + width) * 100;
    const y2 = (endY ?? y) * 100;

    return (
      <AbsoluteFill>
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity }}
        >
          {shapeType === 'arrow' && (
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={strokeColour} />
              </marker>
            </defs>
          )}
          <line
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}
            stroke={strokeColour}
            strokeWidth={strokeWidth}
            markerEnd={shapeType === 'arrow' ? 'url(#arrowhead)' : undefined}
          />
        </svg>
      </AbsoluteFill>
    );
  }

  return null;
};
