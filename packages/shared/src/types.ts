export type VideoStatus = 'uploaded' | 'processing' | 'ready' | 'error';

export interface VideoRow {
  id: string;
  created_at: string;
  title: string | null;
  original_path: string;
  proxy_path: string | null;
  first_frame_path: string | null;
  duration_sec: number | null;
  fps: number | null;
  width: number | null;
  height: number | null;
  status: VideoStatus;
  error_message: string | null;
}

export interface BBoxNorm { x: number; y: number; w: number; h: number }

export interface PlayerSelectionRow {
  id: string;
  video_id: string;
  x: number; y: number; w: number; h: number;
  created_at: string;
}

export type MomentType = 'touch' | 'shot' | 'sprint' | 'custom';
export type Confidence = 'low' | 'med' | 'high';

export interface MomentRow {
  id: string;
  video_id: string;
  type: MomentType;
  start_sec: number;
  end_sec: number;
  confidence: Confidence;
  source: 'auto' | 'manual';
  notes: string | null;
}

export interface ClipRow {
  id: string;
  moment_id: string;
  video_id: string;
  clip_path: string;
  created_at: string;
}

export interface ReportRow {
  id: string;
  video_id: string;
  input_json: unknown;
  output_md: string;
  created_at: string;
}

export interface TrackFrame {
  t: number; // seconds
  bbox: BBoxNorm;
  conf: Confidence | 'missing';
}

export interface TrackJson {
  fps: number;
  frames: TrackFrame[];
}
