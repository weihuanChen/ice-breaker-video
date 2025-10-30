// Cache and revalidation configuration

/**
 * ISR Revalidation Time
 *
 * Controls how often static pages are regenerated.
 *
 * Recommended values:
 * - Development: 60 (1 minute) - Fast iteration
 * - Staging: 3600 (1 hour) - Testing with realistic caching
 * - Production: 14400 (4 hours) or 86400 (24 hours) - Optimize for performance
 *
 * Based on your use case:
 * - Early development: Multiple updates per day -> use 3600 (1 hour)
 * - After launch: Weekly updates -> use 86400 (24 hours)
 */
export const REVALIDATE_TIME = process.env.NODE_ENV === 'production'
  ? 14400  // 4 hours in production
  : 60     // 1 minute in development

/**
 * Database query cache time (in seconds)
 * Used for frequently accessed queries
 */
export const DB_CACHE_TIME = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 3600,    // 1 hour
  LONG: 14400,     // 4 hours
}
