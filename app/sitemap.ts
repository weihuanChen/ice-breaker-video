import { MetadataRoute } from 'next'
import { getAllTags } from '@/lib/queries/tags'
import { db, VideosTable } from '@/lib/drizzle'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://icebreakergames.video'

  // Get all tags and videos
  const [tags, videos] = await Promise.all([
    getAllTags(),
    db.select().from(VideosTable)
  ])

  const sitemap: MetadataRoute.Sitemap = [
    // Static pages
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shorts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/long-form`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Add individual video pages
  videos.forEach((video) => {
    sitemap.push({
      url: `${baseUrl}/video/${video.slug}`,
      lastModified: video.updatedAt || video.createdAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Add tag pages (main)
  tags.forEach((tag) => {
    sitemap.push({
      url: `${baseUrl}/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })

  // Add tag pages (shorts)
  tags.forEach((tag) => {
    sitemap.push({
      url: `${baseUrl}/shorts/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Add tag pages (long-form)
  tags.forEach((tag) => {
    sitemap.push({
      url: `${baseUrl}/long-form/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  return sitemap
}
