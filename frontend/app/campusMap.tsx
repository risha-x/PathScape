'use client';

import { useEffect, useRef } from 'react';

interface Location {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
}

interface CampusMapProps {
  locations: Location[];
  route: { x: number; y: number; z: number; label: string }[] | null;
  origin: string;
  destination: string;
  fullScreen?: boolean;
}

export default function CampusMap({
  locations,
  route,
  origin,
  destination,
  fullScreen = false,
}: CampusMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = fullScreen ? 1400 : 400;
  const canvasHeight = fullScreen ? 900 : 300;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid background - subtle in fullscreen
    if (!fullScreen) {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    }

    // Calculate bounds and scale
    if (locations.length === 0) return;

    const xs = locations.map((l) => l.x);
    const ys = locations.map((l) => l.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const padding = fullScreen ? 80 : 40;
    const scaleX = (canvas.width - 2 * padding) / (maxX - minX || 1);
    const scaleY = (canvas.height - 2 * padding) / (maxY - minY || 1);

    const toCanvasX = (x: number) => (x - minX) * scaleX + padding;
    const toCanvasY = (y: number) => (y - minY) * scaleY + padding;

    // Draw route first (background) - PROMINENT
    if (route && route.length > 1) {
      // Draw thick path line
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = fullScreen ? 10 : 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(toCanvasX(route[0].x), toCanvasY(route[0].y));
      for (let i = 1; i < route.length; i++) {
        ctx.lineTo(toCanvasX(route[i].x), toCanvasY(route[i].y));
      }
      ctx.stroke();

      // Draw glow effect for path
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
      ctx.lineWidth = fullScreen ? 25 : 8;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(route[0].x), toCanvasY(route[0].y));
      for (let i = 1; i < route.length; i++) {
        ctx.lineTo(toCanvasX(route[i].x), toCanvasY(route[i].y));
      }
      ctx.stroke();

      // Draw route waypoints
      for (let i = 0; i < route.length; i++) {
        const isStart = i === 0;
        const isEnd = i === route.length - 1;
        const radius = fullScreen ? 12 : 5;

        ctx.fillStyle = isStart ? '#00ff88' : isEnd ? '#00d4ff' : '#ffdc57';
        ctx.beginPath();
        ctx.arc(toCanvasX(route[i].x), toCanvasY(route[i].y), radius, 0, Math.PI * 2);
        ctx.fill();

        // Add border to waypoints
        ctx.strokeStyle = isStart ? '#00cc66' : isEnd ? '#0099bb' : '#ccaa00';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label waypoints in full screen mode
        if (fullScreen) {
          ctx.fillStyle = '#333';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(route[i].label, toCanvasX(route[i].x), toCanvasY(route[i].y) - 25);
        }
      }
    }

    // Draw all locations - muted
    locations.forEach((loc) => {
      const cx = toCanvasX(loc.x);
      const cy = toCanvasY(loc.y);

      // Highlight origin and destination with subtle backgrounds
      if (loc.id === origin) {
        ctx.fillStyle = '#00ff88';
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(cx, cy, fullScreen ? 30 : 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
      if (loc.id === destination) {
        ctx.fillStyle = '#00d4ff';
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(cx, cy, fullScreen ? 30 : 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw building marker - subtle
      ctx.fillStyle = '#b0b0b0';
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1.5;
      const size = fullScreen ? 12 : 8;
      ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
      ctx.strokeRect(cx - size / 2, cy - size / 2, size, size);

      // Draw label
      ctx.fillStyle = '#555';
      ctx.font = fullScreen ? 'bold 12px sans-serif' : '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(loc.label, cx, cy + (fullScreen ? 30 : 25));
    });

    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = fullScreen ? 'bold 18px sans-serif' : 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('UCSC Campus Map', fullScreen ? 30 : 10, fullScreen ? 40 : 20);
  }, [locations, route, origin, destination, fullScreen]);

  return (
    <div
      style={{
        background: 'white',
        borderRadius: fullScreen ? 12 : 12,
        border: fullScreen ? '2px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(0, 0, 0, 0.2)',
        boxShadow: fullScreen ? '0 8px 24px rgba(0, 0, 0, 0.12)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        width: fullScreen ? '100%' : 'auto',
        height: fullScreen ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ display: 'block', flex: 1 }}
      />
      {!fullScreen && (
        <div
          style={{
            padding: '12px 16px',
            fontSize: '0.85rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            background: '#fafafa',
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: '#00ff88' }}>■</strong> Start{' '}
            <strong style={{ color: '#00d4ff' }}>■</strong> Destination{' '}
            <strong style={{ color: '#ffdc57' }}>■</strong> Waypoints
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            Powered by UCSC Maps
          </div>
        </div>
      )}
    </div>
  );
}
