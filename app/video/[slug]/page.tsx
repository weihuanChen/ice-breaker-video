import { notFound } from 'next/navigation'
import Link from 'next/link'
import { eq, desc, ne } from 'drizzle-orm'
import { db, VideosTable, type Video } from '@/lib/drizzle'
import { VideoPlayer } from '@/components/video-player'
import { VideoCard } from '@/components/video-card'
import { TagBadge } from '@/components/tag-badge'
import { Clock, ArrowLeft } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { getTagsByVideoId } from '@/lib/queries/tags'

// ISR: Revalidate every 4 hours
export const revalidate = 14400

async function getVideo(slug: string): Promise<Video | null> {
  const videos = await db
    .select()
    .from(VideosTable)
    .where(eq(VideosTable.slug, slug))
    .limit(1)

  return videos[0] || null
}

async function getRelatedVideos(currentVideoId: number, category: string): Promise<Video[]> {
  return await db
    .select()
    .from(VideosTable)
    .where(ne(VideosTable.id, currentVideoId))
    .orderBy(desc(VideosTable.createdAt))
    .limit(4)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const video = await getVideo(slug)

  if (!video) {
    return {
      title: 'Video Not Found',
    }
  }

  return {
    title: `${video.title} - Icebreak Games`,
    description: video.description || `Watch ${video.title} on Icebreak Games`,
  }
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const video = await getVideo(slug)

  if (!video) {
    notFound()
  }

  const relatedVideos = await getRelatedVideos(video.id, video.category || 'long')
  const videoTags = await getTagsByVideoId(video.id)

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to all videos</span>
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <VideoPlayer videoId={video.videoId} title={video.title} />

          {/* Video Info */}
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                {video.category === 'short' ? 'Short Video' : 'Long Video'}
              </span>
              {video.durationSeconds && (
                <span className="inline-flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(video.durationSeconds)}</span>
                </span>
              )}
            </div>

            <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              {video.title}
            </h1>

            {/* Video Tags */}
            {videoTags.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {videoTags.map((tag) => (
                  <TagBadge
                    key={tag.tagId}
                    tag={tag}
                    variant="outline"
                    size="md"
                    showIcon={true}
                    href={`/?tags=${tag.slug}`}
                  />
                ))}
              </div>
            )}

            {video.channelTitle && (
              <p className="mb-4 text-lg text-muted-foreground">
                By {video.channelTitle}
              </p>
            )}

            {video.description && (
              <div className="mt-6">
                <h2 className="mb-3 text-xl font-semibold">About this video</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {video.description}
                </p>
              </div>
            )}

            {/* Watch on YouTube Link */}
            <div className="mt-6">
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <span>Watch on YouTube</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar - Related Videos */}
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-xl font-semibold">Related Videos</h2>
          {relatedVideos.length > 0 ? (
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <VideoCard key={relatedVideo.id} video={relatedVideo} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No related videos available yet.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
