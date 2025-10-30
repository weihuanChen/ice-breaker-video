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

  // Get currently selected tags from URL
  const selectedTagSlugs = searchParams.get('tags')?.split(',').filter(Boolean) || []

  const toggleTag = (tagSlug: string) => {
    const newParams = new URLSearchParams(searchParams.toString())

    let updatedTags: string[]
    if (selectedTagSlugs.includes(tagSlug)) {
      // Remove tag
      updatedTags = selectedTagSlugs.filter((slug) => slug !== tagSlug)
    } else {
      // Add tag
      updatedTags = [...selectedTagSlugs, tagSlug]
    }

    if (updatedTags.length > 0) {
      newParams.set('tags', updatedTags.join(','))
    } else {
      newParams.delete('tags')
    }

    // Navigate with updated params
    const queryString = newParams.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
  }

  const clearAllTags = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('tags')
    const queryString = newParams.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
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
