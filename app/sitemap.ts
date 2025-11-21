import { MetadataRoute } from 'next'
import { getAllTags } from '@/lib/queries/tags'
import { generateVideoSitemapEntries } from '@/lib/queries/videos'

const BASE_URL = 'https://icebreakergames.video'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tags, videoEntries] = await Promise.all([
    getAllTags(),
    generateVideoSitemapEntries(BASE_URL)
  ])

  const sitemap: MetadataRoute.Sitemap = [
    // Static pages
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/shorts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/long-form`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Add individual video pages
  sitemap.push(...videoEntries)

  // Add tag pages (main)
  tags.forEach((tag) => {
    sitemap.push({
      url: `${BASE_URL}/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })

  // Add tag pages (shorts)
  tags.forEach((tag) => {
    sitemap.push({
      url: `${BASE_URL}/shorts/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Add tag pages (long-form)
  tags.forEach((tag) => {
    sitemap.push({
      url: `${BASE_URL}/long-form/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  return sitemap
}
