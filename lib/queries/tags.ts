import { desc, eq, inArray, sql, and } from 'drizzle-orm'
import { db, TagsTable, VideoTagsTable, VideosTable, type Tag, type Video } from '@/lib/drizzle'

export type TagWithCount = Tag & { videoCount: number }

/**
 * Get all tags with their video counts
 */
export async function getAllTags(): Promise<TagWithCount[]> {
  const result = await db
    .select({
      tagId: TagsTable.tagId,
      name: TagsTable.name,
      slug: TagsTable.slug,
      videoCount: sql<number>`count(${VideoTagsTable.videoId})::int`,
    })
    .from(TagsTable)
    .leftJoin(VideoTagsTable, eq(TagsTable.tagId, VideoTagsTable.tagId))
    .groupBy(TagsTable.tagId)
    .orderBy(desc(sql`count(${VideoTagsTable.videoId})`))

  return result
}

/**
 * Get videos by tag slugs (OR logic) with optional category filter
 * @param tagSlugs - Array of tag slugs to filter by
 * @param category - Optional category filter ('short' or 'long')
 */
export async function getVideosByTags(
  tagSlugs: string[],
  category?: string
): Promise<Video[]> {
  if (tagSlugs.length === 0) {
    return []
  }

  // First, get tag IDs from slugs
  const tags = await db
    .select()
    .from(TagsTable)
    .where(inArray(TagsTable.slug, tagSlugs))

  if (tags.length === 0) {
    return []
  }

  const tagIds = tags.map((tag) => tag.tagId)

  // Get videos that have any of these tags
  const videoIdsQuery = db
    .selectDistinct({ videoId: VideoTagsTable.videoId })
    .from(VideoTagsTable)
    .where(inArray(VideoTagsTable.tagId, tagIds))

  const videoIdsResult = await videoIdsQuery
  const videoIds = videoIdsResult.map((row) => row.videoId)

  if (videoIds.length === 0) {
    return []
  }

  // Build the final query with optional category filter
  if (category) {
    // With category filter
    const videos = await db
      .select()
      .from(VideosTable)
      .where(and(inArray(VideosTable.id, videoIds), eq(VideosTable.category, category)))
      .orderBy(desc(VideosTable.createdAt))
    return videos
  } else {
    // Without category filter
    const videos = await db
      .select()
      .from(VideosTable)
      .where(inArray(VideosTable.id, videoIds))
      .orderBy(desc(VideosTable.createdAt))
    return videos
  }
}

/**
 * Get all tags associated with a specific video
 * @param videoId - The video ID
 */
export async function getTagsByVideoId(videoId: number): Promise<Tag[]> {
  const result = await db
    .select({
      tagId: TagsTable.tagId,
      name: TagsTable.name,
      slug: TagsTable.slug,
    })
    .from(VideoTagsTable)
    .innerJoin(TagsTable, eq(VideoTagsTable.tagId, TagsTable.tagId))
    .where(eq(VideoTagsTable.videoId, videoId))
    .orderBy(TagsTable.name)

  return result
}

/**
 * Get videos by tags for a specific category (combined filter)
 * This is a convenience function that combines tag and category filtering
 */
export async function getVideosByTagsAndCategory(
  tagSlugs: string[],
  category: 'short' | 'long'
): Promise<Video[]> {
  return getVideosByTags(tagSlugs, category)
}
