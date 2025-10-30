'use client'

import { useState, useEffect } from 'react'
import { VideoCard } from '@/components/video-card'
import { Loader2 } from 'lucide-react'
import { InferSelectModel } from 'drizzle-orm'
import { VideosTable } from '@/lib/drizzle'
import { cn } from '@/lib/utils'

type Video = InferSelectModel<typeof VideosTable>

interface LoadMoreVideosProps {
  initialVideos: Video[]
  totalCount: number
  searchQuery?: string
  tagSlugs?: string[]
}

export function LoadMoreVideos({
  initialVideos,
  totalCount,
  searchQuery,
  tagSlugs,
}: LoadMoreVideosProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialVideos.length < totalCount)

  // Reset when search or tags change
  useEffect(() => {
    setVideos(initialVideos)
    setPage(1)
    setHasMore(initialVideos.length < totalCount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, tagSlugs?.join(','), totalCount])

  const loadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const params = new URLSearchParams({
        page: nextPage.toString(),
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (tagSlugs && tagSlugs.length > 0) {
        params.append('tags', tagSlugs.join(','))
      }

      const response = await fetch(`/api/videos?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch videos')
      }

      const data = await response.json()

      setVideos((prev) => [...prev, ...data.videos])
      setPage(nextPage)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error loading more videos:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Video count info */}
      <div className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{totalCount}</span> video{totalCount !== 1 ? 's' : ''} total
        {videos.length < totalCount && (
          <>
            , <span className="font-semibold text-foreground">{videos.length}</span> loaded
          </>
        )}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-sm font-medium transition-colors',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'disabled:pointer-events-none disabled:opacity-50',
              'min-w-[200px]'
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* All loaded message */}
      {!hasMore && videos.length > 0 && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          All videos loaded
        </div>
      )}
    </div>
  )
}
