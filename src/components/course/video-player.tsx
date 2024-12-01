// Path: /src/components/course/video-player.tsx
"use client"

interface VideoPlayerProps {
  videoUrl: string
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  return (
    <div className="relative aspect-video">
      <iframe
        className="w-full h-full rounded-md"
        src={videoUrl}
        title="Video player"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  )
}