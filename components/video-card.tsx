import Link from 'next/link'
import Image from 'next/image'
import { Clock, Video as VideoIcon } from 'lucide-react'
import { cn, formatDuration } from '@/lib/utils'
import type { Video } from '@/lib/drizzle'

interface VideoCardProps {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`
  const isShort = video.category === 'short'

  return (
    <Link href={`/video/${video.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Duration Badge */}
          {video.durationSeconds && (
            <div className="absolute bottom-2 right-2 flex items-center space-x-1 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(video.durationSeconds)}</span>
            </div>
          )}
          {/* Category Badge */}
          <div
            className={cn(
              'absolute top-2 left-2 rounded-full px-2 py-1 text-xs font-semibold',
              isShort
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-primary text-primary-foreground'
            )}
          >
            <div className="flex items-center space-x-1">
              <VideoIcon className="h-3 w-3" />
              <span>{isShort ? 'Short' : 'Long'}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-tight text-card-foreground transition-colors group-hover:text-primary">
            {video.title}
          </h3>
          {video.channelTitle && (
            <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export function VideoCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="aspect-video w-full animate-pulse bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
