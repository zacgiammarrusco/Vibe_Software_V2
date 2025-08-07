
'use client';
import { useEffect, useRef, useState } from 'react';
import Controls from '@/components/Controls';
import RegionList from '@/components/RegionList';
import VideoCanvas from '@/components/VideoCanvas';
import { buildFilter, Region } from '@/lib/buildFilter';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [regions, setRegions] = useState<Region[]>([]);
  const [dims, setDims] = useState<{w:number,h:number}>({w:1280,h:720});
  const [processing, setProcessing] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    } else {
      setVideoUrl(undefined);
    }
    return () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }
  }, [file]);

  // Lazy load ffmpeg.wasm
  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  };

  const onExport = async () => {
    if (!file || regions.length===0) return;
    setProcessing(true);
    try {
      const ffmpeg = await loadFFmpeg();
      const data = new Uint8Array(await file.arrayBuffer());
      // input name must have extension
      const input = 'input.mp4';
      const output = 'output.mp4';
      await ffmpeg.writeFile(input, data);
      const filter = buildFilter(regions, dims.w, dims.h);
      const args = [
        '-i', input,
        '-filter_complex', filter,
        '-map', '[outv]',
        '-map', '0:a?',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '23',
        '-movflags', 'faststart',
        output
      ];
      await ffmpeg.exec(args);
      const out = await ffmpeg.readFile(output);
      const blob = new Blob([out], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'redacted.mp4'; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Export failed. Try a shorter clip or fewer regions. See console for details.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="p-4 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Video Redaction MVP</h1>
      <p className="opacity-80">Upload a video, draw one or more blur boxes, set their start/end, and export. All processing happens locally in your browser.</p>
      <Controls onLoadFile={setFile} onExport={onExport} disabledExport={!file || regions.length===0 || processing} />
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <VideoCanvas src={videoUrl} onAddRegion={(r)=> setRegions(prev=>[...prev, r])} videoDims={(w,h)=>setDims({w,h})} />
        </div>
        <div className="space-y-2">
          <RegionList regions={regions} onDelete={(i)=> setRegions(prev => prev.filter((_,idx)=>idx!==i))} />
          <div className="card text-xs opacity-80">
            <div className="font-semibold mb-2">Tips</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>For best results, use short clips (&lt; 2 minutes). Browser-based FFmpeg is memory intensive.</li>
              <li>Press S/E to mark start/end, Enter to add a region.</li>
              <li>Multiple regions are supported; they can overlap and have different time ranges.</li>
            </ul>
            {processing && <div className="mt-2">Processing… this can take a while for longer videos.</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
