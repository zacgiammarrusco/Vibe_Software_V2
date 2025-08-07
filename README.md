
# Video Redaction MVP (Next.js + FFmpeg.wasm)

A minimal, local-first video redaction demo:
- Upload a video in your browser
- Draw one or more rectangular regions
- Set start/end times for each region
- Export a redacted MP4 (box-blur) — all client-side via WebAssembly

## Quick Start
```bash
pnpm i # or npm i / yarn
pnpm dev # or npm run dev / yarn dev
# Open http://localhost:3000
```

## Notes / Limits
- Use short clips (< 2 minutes) for reliability. In-browser FFmpeg is memory-heavy.
- H.264 MP4 input recommended. Other formats may require transcoding.
- This is an MVP meant to prove the flow and UI. For production, use a server-side pipeline with native FFmpeg, a job queue, resumable uploads, and object storage.

## Roadmap (Production)
- Server-side rendering jobs (Node + native ffmpeg) with Redis/BullMQ
- Object storage (S3/GCS) + signed URLs
- Auth (Auth.js) + roles (admin/reviewer)
- Projects, timelines, and audit logs
- ML auto-detection (faces/plates) via server workers (ONNX Runtime, CUDA when available)
- Review tools (playlists, annotation, QC checks)


## Deploy to Vercel (Quick)
1. Push this repo to GitHub.
2. In Vercel, click **New Project** → import the repo.
3. Accept defaults (Next.js detected) → Deploy.

## GitHub Actions
This repo includes `.github/workflows/ci.yml` to lint and build on every push/PR.
