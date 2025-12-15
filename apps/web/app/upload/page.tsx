'use client'

import { useState } from 'react'
import { supabase, VIDEO_BUCKET_NAME } from '@/lib/supabaseClient'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  async function handleUpload() {
    if (!file) return
    setIsUploading(true)
    setStatus('Preparing upload...')

    try {
      const videoId = crypto.randomUUID()
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4'
      if (!['mp4', 'mov'].includes(ext)) {
        setStatus('Please upload an mp4 or mov file')
        setIsUploading(false)
        return
      }

      const path = `videos/${videoId}/original.${ext}`

      setStatus('Uploading to storage...')
      const { error: uploadErr } = await supabase
        .storage
        .from(VIDEO_BUCKET_NAME)
        .upload(path, file, { upsert: false })

      if (uploadErr) throw uploadErr

      setStatus('Recording upload in database...')
      const { error: dbErr } = await supabase
        .from('videos')
        .insert({
          id: videoId,
          title: file.name,
          original_path: path,
          status: 'uploaded',
        })

      if (dbErr) throw dbErr

      setStatus('Upload complete! Redirecting...')
      window.location.href = `/videos/${videoId}`
    } catch (e: any) {
      console.error(e)
      setStatus(`Error: ${e.message || 'unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Upload a clip</h1>
      <p className="text-sm text-muted-foreground mb-6">Accepted formats: mp4, mov</p>
      <input
        type="file"
        accept="video/mp4,video/quicktime"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-4 block w-full"
      />
      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  )
}
