import { Suspense } from 'react'
import { desc, ilike, or } from 'drizzle-orm'
import { db, VideosTable } from '@/lib/drizzle'
import { VideoCard, VideoCardSkeleton } from '@/components/video-card'
import { TagFilter } from '@/components/tag-filter'
import { getAllTags, getVideosByTags } from '@/lib/queries/tags'
import { LoadMoreVideos } from '@/components/load-more-videos'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const VIDEOS_PER_PAGE = 20

// ISR: Static page regeneration time
export const revalidate = 14400

async function getVideos(searchQuery?: string, tagSlugs?: string[], limit?: number, offset?: number) {
  // If tags are selected, use tag filtering
  if (tagSlugs && tagSlugs.length > 0) {
    const taggedVideos = await getVideosByTags(tagSlugs)

    // If there's also a search query, filter the tagged videos
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const filtered = taggedVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchLower) ||
          video.description?.toLowerCase().includes(searchLower)
      )
      // Apply pagination to filtered results
      if (limit !== undefined && offset !== undefined) {
        return filtered.slice(offset, offset + limit)
      }
      return filtered
    }

    // Apply pagination to tagged videos
    if (limit !== undefined && offset !== undefined) {
      return taggedVideos.slice(offset, offset + limit)
    }
    return taggedVideos
  }

  // No tags selected, use regular search/all videos
  let query = db.select().from(VideosTable)

  if (searchQuery) {
    query = query.where(
      or(
        ilike(VideosTable.title, `%${searchQuery}%`),
        ilike(VideosTable.description, `%${searchQuery}%`)
      )
    ) as any
  }

  query = query.orderBy(desc(VideosTable.createdAt)) as any

  // Apply pagination
  if (limit !== undefined) {
    query = query.limit(limit) as any
  }
  if (offset !== undefined) {
    query = query.offset(offset) as any
  }

  return await query
}

async function getTotalVideosCount(searchQuery?: string, tagSlugs?: string[]) {
  // If tags are selected, count filtered videos
  if (tagSlugs && tagSlugs.length > 0) {
    const taggedVideos = await getVideosByTags(tagSlugs)

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      return taggedVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchLower) ||
          video.description?.toLowerCase().includes(searchLower)
      ).length
    }

    return taggedVideos.length
  }

  // No tags, count all or search results
  if (searchQuery) {
    const results = await db
      .select()
      .from(VideosTable)
      .where(
        or(
          ilike(VideosTable.title, `%${searchQuery}%`),
          ilike(VideosTable.description, `%${searchQuery}%`)
        )
      )
    return results.length
  }

  const allVideos = await db.select().from(VideosTable)
  return allVideos.length
}

async function VideoGrid({
  searchQuery,
  tagSlugs,
}: {
  searchQuery?: string
  tagSlugs?: string[]
}) {
  const [initialVideos, totalCount] = await Promise.all([
    getVideos(searchQuery, tagSlugs, VIDEOS_PER_PAGE, 0),
    getTotalVideosCount(searchQuery, tagSlugs)
  ])

  if (totalCount === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search term.`
              : 'No videos found with the selected tags. Try different tags.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <LoadMoreVideos
      initialVideos={initialVideos}
      totalCount={totalCount}
      searchQuery={searchQuery}
      tagSlugs={tagSlugs}
    />
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
    ? `${tagNames.join(' + ')} - Icebreaker Games`
    : 'Tagged Icebreaker Games'

  const description = tagNames.length > 0
    ? `Discover icebreaker games for ${tagNames.join(', ')}. Fun and engaging activities to energize your team, classroom, or event.`
    : 'Browse icebreaker games by tag'

  return {
    title,
    description,
  }
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slugs: string }>
  searchParams: Promise<{ search?: string }>
}) {
  const { slugs } = await params
  const { search } = await searchParams

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
          {tagNames.length > 0 ? tagNames.join(' + ') : 'Tagged'} Icebreaker Games
        </h1>
        <p className="text-lg text-muted-foreground">
          Fun and engaging activities to energize your team, classroom, or event
        </p>
        {search && (
          <p className="mt-2 text-sm text-muted-foreground">
            Search results for: <span className="font-semibold">{search}</span>
          </p>
        )}
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <TagFilter tags={allTags} />
        </div>
      )}

      <Suspense fallback={<VideoGridSkeleton />}>
        <VideoGrid searchQuery={search} tagSlugs={tagSlugs} />
      </Suspense>
    </main>
  )
}
