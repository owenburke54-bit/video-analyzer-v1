import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const videoBucket = process.env.VIDEO_BUCKET_NAME || 'video-analyzer'

if (!supabaseUrl || !serviceRoleKey) {
  // eslint-disable-next-line no-console
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function pollJobsOnce() {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(1)

  if (error) throw error
  if (!jobs || jobs.length === 0) return

  const job = jobs[0] as any

  // mark running
  await supabase
    .from('jobs')
    .update({ status: 'running', updated_at: new Date().toISOString() })
    .eq('id', job.id)

  try {
    switch (job.type) {
      case 'extract_metadata':
        await handleExtractMetadata(job)
        break
      case 'extract_first_frame':
        await handleExtractFirstFrame(job)
        break
      case 'generate_proxy_mp4':
        await handleGenerateProxy(job)
        break
      case 'track_player':
        await handleTrackPlayer(job)
        break
      case 'generate_highlights':
        await handleGenerateHighlights(job)
        break
      case 'render_clips':
        await handleRenderClips(job)
        break
      case 'generate_report':
        await handleGenerateReport(job)
        break
      default:
        throw new Error(`Unknown job type: ${job.type}`)
    }

    await supabase
      .from('jobs')
      .update({ status: 'done', updated_at: new Date().toISOString() })
      .eq('id', job.id)
  } catch (e: any) {
    await supabase
      .from('jobs')
      .update({ status: 'error', error_message: e.message, updated_at: new Date().toISOString() })
      .eq('id', job.id)
  }
}

async function loop() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await pollJobsOnce()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
    await new Promise((r) => setTimeout(r, 1500))
  }
}

// Handlers (stubs for V1 scaffolding)
async function handleExtractMetadata(job: any) {
  // TODO: ffprobe to get duration/fps/width/height and update videos
  // placeholder
}

async function handleExtractFirstFrame(job: any) {
  // TODO: ffmpeg -ss 0 -frames:v 1 to storage
}

async function handleGenerateProxy(job: any) {
  // TODO: ffmpeg transcode proxy to storage
}

async function handleTrackPlayer(job: any) {
  // TODO: OpenCV tracking and write track.json to storage
}

async function handleGenerateHighlights(job: any) {
  // TODO: Heuristics to create moments
}

async function handleRenderClips(job: any) {
  // TODO: ffmpeg trim per moment
}

async function handleGenerateReport(job: any) {
  // TODO: call OpenAI and store markdown
}

loop().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('Worker crashed', e)
  process.exit(1)
})
