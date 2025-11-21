import { desc } from 'drizzle-orm'
import { db, VideosTable } from '@/lib/drizzle'
import type { MetadataRoute } from 'next'

/**
 * Build sitemap entries for all videos.
 * Only selects fields needed for the sitemap to keep the query light.
 */
export async function generateVideoSitemapEntries(
  baseUrl: string
): Promise<MetadataRoute.Sitemap> {
  const videos = await db
    .select({
      slug: VideosTable.slug,
      updatedAt: VideosTable.updatedAt,
      createdAt: VideosTable.createdAt,
    })
    .from(VideosTable)
    .orderBy(desc(VideosTable.updatedAt))

  return videos.map((video) => ({
    url: `${baseUrl}/video/${video.slug}`,
    lastModified: video.updatedAt || video.createdAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))
}
