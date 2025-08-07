
export type Region = {
  x: number; y: number; w: number; h: number;
  start: number; end: number;
};

// Build a filter_complex that applies a boxblur over multiple rectangular regions, time-bound
export function buildFilter(regions: Region[], width: number, height: number) {
  // Base label
  let filter = `[0:v]scale=${width}:${height},format=yuv420p[base];`;
  let lastLabel = "base";
  let chainIndex = 0;

  for (const r of regions) {
    const lblBlur = `b${chainIndex}`;
    const lblOut = `o${chainIndex}`;
    // Crop the area to blur from the last stream, blur it, then overlay back with enable time window
    filter += `[${lastLabel}]crop=${r.w}:${r.h}:${r.x}:${r.y},boxblur=20:1,format=rgba[${lblBlur}];`;
    filter += `[${lastLabel}][${lblBlur}]overlay=${r.x}:${r.y}:enable='between(t,${r.start},${r.end})'[${lblOut}];`;
    lastLabel = lblOut;
    chainIndex++;
  }
  filter += `[${lastLabel}]copy[outv]`;
  return filter;
}
