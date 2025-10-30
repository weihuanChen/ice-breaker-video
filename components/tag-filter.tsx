'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TagWithCount } from '@/lib/queries/tags'

interface TagFilterProps {
  tags: TagWithCount[]
  className?: string
}

export function TagFilter({ tags, className }: TagFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get currently selected tags from URL (new format: /tag/slug1+slug2)
  const getSelectedTagSlugs = (): string[] => {
    // Check if we're on a tag route
    if (pathname.includes('/tag/')) {
      const match = pathname.match(/\/tag\/([^/]+)/)
      if (match) {
        return match[1].split('+').filter(Boolean)
      }
    }
    // Fallback to old query param format (for backwards compatibility)
    return searchParams.get('tags')?.split(',').filter(Boolean) || []
  }

  const selectedTagSlugs = getSelectedTagSlugs()

  // Determine base path for navigation
  const getBasePath = (): string => {
    if (pathname.startsWith('/shorts')) return '/shorts'
    if (pathname.startsWith('/long-form')) return '/long-form'
    return ''
  }

  const toggleTag = (tagSlug: string) => {
    let updatedTags: string[]
    if (selectedTagSlugs.includes(tagSlug)) {
      // Remove tag
      updatedTags = selectedTagSlugs.filter((slug) => slug !== tagSlug)
    } else {
      // Add tag
      updatedTags = [...selectedTagSlugs, tagSlug]
    }

    const basePath = getBasePath()

    if (updatedTags.length > 0) {
      // Navigate to new tag URL format: /tag/slug1+slug2 or /shorts/tag/slug1+slug2
      const tagPath = updatedTags.join('+')
      const newPath = basePath ? `${basePath}/tag/${tagPath}` : `/tag/${tagPath}`

      // Preserve other search params (like search query)
      const otherParams = new URLSearchParams()
      searchParams.forEach((value, key) => {
        if (key !== 'tags') {
          otherParams.set(key, value)
        }
      })
      const queryString = otherParams.toString()
      router.push(queryString ? `${newPath}?${queryString}` : newPath)
    } else {
      // No tags selected, go back to base path
      const otherParams = new URLSearchParams()
      searchParams.forEach((value, key) => {
        if (key !== 'tags') {
          otherParams.set(key, value)
        }
      })
      const queryString = otherParams.toString()
      const returnPath = basePath || '/'
      router.push(queryString ? `${returnPath}?${queryString}` : returnPath)
    }
  }

  const clearAllTags = () => {
    const basePath = getBasePath()
    const otherParams = new URLSearchParams()
    searchParams.forEach((value, key) => {
      if (key !== 'tags') {
        otherParams.set(key, value)
      }
    })
    const queryString = otherParams.toString()
    const returnPath = basePath || '/'
    router.push(queryString ? `${returnPath}?${queryString}` : returnPath)
  }

  if (tags.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Filter by Tags</h3>
        {selectedTagSlugs.length > 0 && (
          <button
            onClick={clearAllTags}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTagSlugs.includes(tag.slug)
          return (
            <button
              key={tag.tagId}
              onClick={() => toggleTag(tag.slug)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              <span>{tag.name}</span>
              {tag.videoCount > 0 && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs',
                    isSelected
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-secondary-foreground/10 text-secondary-foreground'
                  )}
                >
                  {tag.videoCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {selectedTagSlugs.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing videos with {selectedTagSlugs.length === 1 ? 'tag' : 'any of these tags'}:{' '}
          <span className="font-medium">
            {selectedTagSlugs
              .map((slug) => tags.find((t) => t.slug === slug)?.name)
              .filter(Boolean)
              .join(', ')}
          </span>
        </p>
      )}
    </div>
  )
}
