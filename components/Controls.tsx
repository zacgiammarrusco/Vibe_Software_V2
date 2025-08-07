
'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onLoadFile: (file: File) => void;
  onExport: () => void;
  disabledExport?: boolean;
};

export default function Controls({ onLoadFile, onExport, disabledExport }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>('');

  return (
    <div className="card flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button onClick={() => inputRef.current?.click()} className="bg-white text-black">Upload Video</button>
        <input ref={inputRef} type="file" accept="video/*" className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setFileName(f.name); onLoadFile(f); }
          }} />
        <span className="opacity-80 text-sm">{fileName || 'No file selected'}</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onExport} className="bg-white text-black disabled:opacity-40" disabled={disabledExport}>Export Redacted</button>
      </div>
    </div>
  )
}
