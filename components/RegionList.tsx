
'use client';
import { Region } from '@/lib/buildFilter';

export default function RegionList({ regions, onDelete }: { regions: Region[], onDelete: (i:number)=>void }) {
  return (
    <div className="card">
      <div className="font-semibold mb-2">Regions ({regions.length})</div>
      <div className="space-y-2 max-h-64 overflow-auto pr-2">
        {regions.map((r, i) => (
          <div key={i} className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center bg-[var(--muted)] rounded-xl p-2">
            <div className="text-xs">x:{Math.round(r.x)} y:{Math.round(r.y)}</div>
            <div className="text-xs">w:{Math.round(r.w)} h:{Math.round(r.h)}</div>
            <div className="text-xs">start:{r.start.toFixed(2)}s</div>
            <div className="text-xs">end:{r.end.toFixed(2)}s</div>
            <button className="bg-white text-black px-2 py-1 rounded-xl text-xs" onClick={()=>onDelete(i)}>Delete</button>
          </div>
        ))}
        {regions.length===0 && <div className="opacity-70 text-sm">Draw a box on the video to add a region. Drag to resize. Press "S" to set start time and "E" for end.</div>}
      </div>
    </div>
  )
}
