import { NextRequest, NextResponse } from 'next/server'
import { desc, ilike, or } from 'drizzle-orm'
import { db, VideosTable } from '@/lib/drizzle'
import { getVideosByTags } from '@/lib/queries/tags'

const VIDEOS_PER_PAGE = 20

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
