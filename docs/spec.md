# video-analyzer-v1 Spec (V1)

[Copied from conversation]

- Product Goal: Web app for individual soccer players to upload clips, track themselves, generate highlight moments and reports.
- Tech Stack: Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Supabase (Postgres+Storage), FFmpeg, OpenCV tracking (CSRT/KCF), OpenAI API. Auth optional.
- Repo/Folder: monorepo with apps/web, apps/worker, packages/shared, supabase/migrations, docs/spec.md
- Core Flow: Upload → Jobs (metadata, first frame, proxy) → Select Player → Track → Highlights → Clips → Report → Manual edits
- DB Schema: tables for videos, player_selections, tracks, moments, clips, reports, jobs
- Worker: Polls jobs table, runs ffmpeg/opencv tasks, stores outputs
- Tracking V1: OpenCV CSRT, per-frame bbox, handle failures, support 2–3 min clips
- Heuristics: Sprint via velocity threshold; involvement via decel/changes; manual moments allowed
- AI Report: Inputs from user and moments; output markdown with caveats and drill plan
- Frontend Pages: /upload, /videos/[id], /videos/[id]/select, /videos/[id]/edit; components: VideoPlayer, Timeline, MomentList, MetricsCards, ReportViewer, BBoxSelector
- Storage: bucket video-analyzer with structured paths
- Env Vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (worker), SUPABASE_ANON_KEY (web), OPENAI_API_KEY, VIDEO_BUCKET_NAME
- Acceptance Criteria and Build Order as described.
