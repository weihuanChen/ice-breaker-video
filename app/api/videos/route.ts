import { NextRequest, NextResponse } from 'next/server'
import { desc, ilike, or, eq, inArray, ne, and, sql } from 'drizzle-orm'
import { db, VideosTable, TagsTable, VideoTagsTable } from '@/lib/drizzle'
import { getVideosByTags } from '@/lib/queries/tags'

const VIDEOS_PER_PAGE = 20

async function getVideos(searchQuery?: string, tagSlugs?: string[], limit?: number, offset?: number) {
  // If tags are selected, use tag filtering with optimized queries
  if (tagSlugs && tagSlugs.length > 0) {
    // Get tag IDs
    const tags = await db
      .select({ tagId: TagsTable.tagId })
      .from(TagsTable)
      .where(inArray(TagsTable.slug, tagSlugs))

    if (tags.length === 0) {
      return []
    }

    const tagIds = tags.map((tag) => tag.tagId)

    // Build main query with tag join
    let query = db
      .selectDistinct({ video: VideosTable })
      .from(VideosTable)
      .innerJoin(VideoTagsTable, eq(VideosTable.id, VideoTagsTable.videoId))
      .where(inArray(VideoTagsTable.tagId, tagIds))

    // Add search filter if provided
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

    const results = await query
    return results.map((row: any) => row.video)
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
  // If tags are selected, count using optimized query
  if (tagSlugs && tagSlugs.length > 0) {
    // Get tag IDs
    const tags = await db
      .select({ tagId: TagsTable.tagId })
      .from(TagsTable)
      .where(inArray(TagsTable.slug, tagSlugs))

    if (tags.length === 0) {
      return 0
    }

    const tagIds = tags.map((tag) => tag.tagId)

    // Build count query with tag join
    let query = db
      .selectDistinct({ id: VideosTable.id })
      .from(VideosTable)
      .innerJoin(VideoTagsTable, eq(VideosTable.id, VideoTagsTable.videoId))
      .where(inArray(VideoTagsTable.tagId, tagIds))

    if (searchQuery) {
      query = query.where(
        or(
          ilike(VideosTable.title, `%${searchQuery}%`),
          ilike(VideosTable.description, `%${searchQuery}%`)
        )
      ) as any
    }

    const result = await query
    return result.length
  }

  // No tags, count by search or all
  if (searchQuery) {
    const result = await db
      .select({ id: VideosTable.id })
      .from(VideosTable)
      .where(
        or(
          ilike(VideosTable.title, `%${searchQuery}%`),
          ilike(VideosTable.description, `%${searchQuery}%`)
        )
      )
    return result.length
  }

  const countResult = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(VideosTable)
  
  return countResult[0]?.count || 0
}

// Mark as dynamic since we need to read searchParams
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || undefined
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || undefined

    const offset = (page - 1) * VIDEOS_PER_PAGE

    const [videos, totalCount] = await Promise.all([
      getVideos(search, tags, VIDEOS_PER_PAGE, offset),
      getTotalVideosCount(search, tags)
    ])

    const hasMore = offset + videos.length < totalCount

    return NextResponse.json({
      videos,
      total: totalCount,
      hasMore,
      page,
    })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

// Add revalidation time for this API route
export const revalidate = 3600 // 1 hour
