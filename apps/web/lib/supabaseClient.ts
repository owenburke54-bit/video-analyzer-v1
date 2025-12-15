import { createClient } from '@supabase/supabase-js';

// Support both legacy and new key names
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;

const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublicKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLIC_KEY (or ANON key).',
  );
}

export const supabase = createClient(supabaseUrl!, supabasePublicKey!, {
  auth: { persistSession: false },
});

export const VIDEO_BUCKET_NAME =
  process.env.NEXT_PUBLIC_VIDEO_BUCKET_NAME || 'video-analyzer-v1';
