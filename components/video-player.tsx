'use client'

import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  videoId: string
  title: string
  className?: string
}

export function VideoPlayer({ videoId, title, className }: VideoPlayerProps) {
  return (
    <div className={cn('relative aspect-video w-full overflow-hidden rounded-lg', className)}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  )
}

// Future extensibility: Add support for other video platforms
// Example structure for multi-platform support:
/*
interface BaseVideoPlayerProps {
  videoId: string
  title: string
  platform: 'youtube' | 'vimeo' | 'bilibili' // Add more platforms as needed
  className?: string
}

export function UniversalVideoPlayer({ videoId, title, platform, className }: BaseVideoPlayerProps) {
  const getEmbedUrl = () => {
    switch (platform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}`
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoId}`
      case 'bilibili':
        return `https://player.bilibili.com/player.html?bvid=${videoId}`
      default:
        return `https://www.youtube.com/embed/${videoId}`
    }
  }

  return (
    <div className={cn('relative aspect-video w-full overflow-hidden rounded-lg', className)}>
      <iframe
        src={getEmbedUrl()}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  )
}
*/
