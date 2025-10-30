import { Suspense } from 'react'
import { desc, eq } from 'drizzle-orm'
import { db, VideosTable } from '@/lib/drizzle'
import { VideoCard, VideoCardSkeleton } from '@/components/video-card'
import { TagFilter } from '@/components/tag-filter'
import { getAllTags, getVideosByTags } from '@/lib/queries/tags'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// ISR: Revalidate every 4 hours
export const revalidate = 14400

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
            No short videos found with the selected tags. Try different tags.
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

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugs: string }>
}): Promise<Metadata> {
  const { slugs } = await params
  const tagSlugs = slugs.split('+').filter(Boolean)

  // Get tag names for better metadata
  const allTags = await getAllTags()
  const tagNames = tagSlugs
    .map(slug => allTags.find(t => t.slug === slug)?.name)
    .filter(Boolean)

  const title = tagNames.length > 0
    ? `${tagNames.join(' + ')} - Short Icebreaker Videos`
    : 'Short Icebreaker Videos'

  const description = tagNames.length > 0
    ? `Quick icebreaker videos for ${tagNames.join(', ')}. Learn engaging activities in minutes.`
    : 'Quick and engaging icebreaker game ideas that you can learn in minutes'

  return {
    title,
    description,
  }
}

export default async function ShortsTagPage({
  params,
}: {
  params: Promise<{ slugs: string }>
}) {
  const { slugs } = await params

  // Parse tag slugs from URL (separated by +)
  const tagSlugs = slugs.split('+').filter(Boolean)

  if (tagSlugs.length === 0) {
    notFound()
  }

  // Get all tags for the filter
  const allTags = await getAllTags()

  // Get tag names for display
  const tagNames = tagSlugs
    .map(slug => allTags.find(t => t.slug === slug)?.name)
    .filter(Boolean)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {tagNames.length > 0 ? `${tagNames.join(' + ')} - ` : ''}Short Videos
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
