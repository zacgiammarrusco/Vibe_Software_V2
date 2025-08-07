
'use client';
import { useEffect, useRef, useState } from 'react';
import { Region } from '@/lib/buildFilter';

type Props = {
  src?: string;
  onAddRegion: (r: Region) => void;
  videoDims: (w:number,h:number)=>void;
};

export default function VideoCanvas({ src, onAddRegion, videoDims }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [rect, setRect] = useState<{x:number,y:number,w:number,h:number} | null>(null);
  const [regionsDraft, setRegionsDraft] = useState<Region | null>(null);

  // When video metadata loads, report dimensions
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => {
      videoDims(v.videoWidth, v.videoHeight);
    };
    v.addEventListener('loadedmetadata', onLoaded);
    return () => v.removeEventListener('loadedmetadata', onLoaded);
  }, [videoDims]);

  // Keyboard shortcuts for start/end
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (!v) return;
      if (!rect) return;
      if (e.key.toLowerCase() === 's') {
        setRegionsDraft(prev => ({ ...(prev ?? {x:rect.x,y:rect.y,w:rect.w,h:rect.h,start:0,end:0}), start: v.currentTime }));
      }
      if (e.key.toLowerCase() === 'e') {
        setRegionsDraft(prev => ({ ...(prev ?? {x:rect.x,y:rect.y,w:rect.w,h:rect.h,start:0,end:0}), end: v.currentTime }));
      }
      if (e.key === 'Enter' && regionsDraft) {
        // finalize
        const r = { ...regionsDraft };
        if (r.end < r.start) { const t = r.start; r.start = r.end; r.end = t; }
        onAddRegion(r);
        setRect(null);
        setRegionsDraft(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rect, regionsDraft, onAddRegion]);

  const mousePos = (e: React.MouseEvent) => {
    const el = overlayRef.current;
    if (!el) return {x:0,y:0};
    const rect = el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <video ref={videoRef} src={src} controls className="w-full rounded-2xl bg-black" />
      <div
        ref={overlayRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={(e)=>{ setDrawing(true); const {x,y} = mousePos(e); setRect({x,y,w:0,h:0}); setRegionsDraft(null);}}
        onMouseMove={(e)=>{
          if (!drawing || !rect) return;
          const {x,y} = mousePos(e);
          setRect(prev => prev ? ({...prev, w: x - prev.x, h: y - prev.y}) : null);
        }}
        onMouseUp={()=> setDrawing(false)}
      >
        {rect && (
          <div
            style={{
              position:'absolute', left: Math.min(rect.x, rect.x+rect.w),
              top: Math.min(rect.y, rect.y+rect.h),
              width: Math.abs(rect.w), height: Math.abs(rect.h),
              border: '2px dashed #fff', background:'rgba(255,255,255,0.1)',
              pointerEvents:'none'
            }}
          />
        )}
      </div>
      <div className="mt-2 text-xs opacity-80">
        Draw a rectangle, press <b>S</b> to set start time, <b>E</b> to set end, then <b>Enter</b> to add region.
      </div>
    </div>
  )
}
