
# Deploying to Vercel + GitHub

## 1) Create a GitHub repo
```bash
git init
git add .
git commit -m "init: video redaction mvp"
git branch -M main
# create a repo on GitHub, then:
git remote add origin https://github.com/<you>/video-redaction-mvp.git
git push -u origin main
```

## 2) Connect to Vercel
- Go to Vercel → **New Project** → **Import** your GitHub repo.
- Framework: **Next.js** (auto-detected)
- Build command: `next build` (auto)
- Output dir: `.next` (auto)
- Env vars: not required for the MVP.
- Deploy.

Vercel will give you a production URL and preview URLs for every PR/branch.

## 3) Local development
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Notes
- This MVP uses **FFmpeg.wasm** in the browser. For large videos, plan a server-side pipeline.
- See `README.md` for roadmap and limitations.


---

### Note on ESLint versions
Vercel + Next.js 14.x expect **eslint 8.x**. This repo pins `eslint@8.57.0` to avoid the `ERESOLVE` peer-deps error with `eslint-config-next@14.2.5`.
