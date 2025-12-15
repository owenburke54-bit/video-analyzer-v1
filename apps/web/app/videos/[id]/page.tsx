import Link from 'next/link'

interface PageProps { params: { id: string } }

export default function VideoPage({ params }: PageProps) {
  const { id } = params
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Video {id}</h1>
      <p>This page will show processing status and results.</p>
      <div>
        <Link href="/upload" className="text-blue-600 underline">Upload another</Link>
      </div>
    </div>
  )
}
