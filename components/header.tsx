'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Video, HelpCircle } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const navItems = [
    { href: '/', label: 'All Videos', icon: Video },
    { href: '/long-form', label: 'Long Videos', icon: Video },
    { href: '/shorts', label: 'Short Videos', icon: Video },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Site Name */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary transition-transform group-hover:scale-110">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Icebreak Games
              </span>
              <span className="text-xs text-muted-foreground">
                icebreakgames.video
              </span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Search and Theme Toggle */}
          <div className="flex items-center space-x-3">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'h-10 w-64 rounded-lg border border-input bg-background pl-10 pr-4',
                  'text-sm placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  'transition-all'
                )}
              />
            </form>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden overflow-x-auto pb-3 space-x-2 -mx-4 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
