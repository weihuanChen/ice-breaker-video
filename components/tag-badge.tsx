import Link from 'next/link'
import { Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Tag as TagType } from '@/lib/drizzle'

interface TagBadgeProps {
  tag: TagType
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md'
  showIcon?: boolean
  href?: string
  onClick?: () => void
  className?: string
}

export function TagBadge({
  tag,
  variant = 'default',
  size = 'sm',
  showIcon = false,
  href,
  onClick,
  className,
}: TagBadgeProps) {
  const baseClasses = cn(
    'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
    {
      // Variant styles
      'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'default',
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
        variant === 'outline',
      // Size styles
      'px-2.5 py-0.5 text-xs': size === 'sm',
      'px-3 py-1 text-sm': size === 'md',
      // Interactive styles
      'cursor-pointer': href || onClick,
    },
    className
  )

  const content = (
    <>
      {showIcon && <Tag className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />}
      <span>{tag.name}</span>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses} type="button">
        {content}
      </button>
    )
  }

  return <span className={baseClasses}>{content}</span>
}
