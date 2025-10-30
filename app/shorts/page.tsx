import { Suspense } from 'react'
import { desc, eq } from 'drizzle-orm'
import { db, VideosTable } from '@/lib/drizzle'
import { VideoCard, VideoCardSkeleton } from '@/components/video-card'
import { TagFilter } from '@/components/tag-filter'
import { getAllTags, getVideosByTags } from '@/lib/queries/tags'

// ISR: Revalidate every 4 hours
export const revalidate = 14400

export const metadata = {
  title: 'Short Videos - Icebreak Games',
  description: 'Quick and engaging icebreaker game ideas for your team or classroom.',
}

async function getShortVideos(tagSlugs?: string[]) {
  // If tags are selected, use tag filtering with category
  if (tagSlugs && tagSlugs.length > 0) {
    return await getVideosByTags(tagSlugs, 'short')
  }

  // No tags, just return all short videos
  return await db
    .select()
    .from(VideosTable)
    .where(eq(VideosTable.category, 'short'))
    .orderBy(desc(VideosTable.createdAt))
}

async function VideoGrid({ tagSlugs }: { tagSlugs?: string[] }) {
  const videos = await getShortVideos(tagSlugs)

  if (videos.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">No short videos found</h3>
          <p className="text-muted-foreground">
            Check back soon for quick icebreaker game ideas!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function ShortsPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string }>
}) {
  const params = await searchParams
  const tagSlugs = params.tags?.split(',').filter(Boolean)

  // Get all tags for the filter
  const allTags = await getAllTags()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Short Videos
        </h1>
        <p className="text-lg text-muted-foreground">
          Quick and engaging icebreaker ideas that you can learn in minutes
        </p>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <TagFilter tags={allTags} />
        </div>
      )}

      <Suspense fallback={<VideoGridSkeleton />}>
        <VideoGrid tagSlugs={tagSlugs} />
      </Suspense>
    </main>
  )
}
