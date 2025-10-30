import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * On-Demand Revalidation API
 *
 * This endpoint allows you to manually trigger page regeneration
 * when your n8n workflow updates video data.
 *
 * Usage:
 * POST https://icebreakgames.video/api/revalidate?secret=YOUR_SECRET_KEY
 *
 * Optional query parameters:
 * - path: specific path to revalidate (default: all pages)
 *
 * Examples:
 * 1. Revalidate all pages:
 *    POST /api/revalidate?secret=YOUR_SECRET_KEY
 *
 * 2. Revalidate specific page:
 *    POST /api/revalidate?secret=YOUR_SECRET_KEY&path=/long-form
 *
 * Setup:
 * 1. Add REVALIDATE_SECRET to your .env.local:
 *    REVALIDATE_SECRET=your-super-secret-key-here
 *
 * 2. In n8n, add HTTP Request node at the end of your workflow:
 *    - Method: POST
 *    - URL: https://icebreakgames.video/api/revalidate?secret=your-super-secret-key-here
 */
export async function POST(request: NextRequest) {
  try {
    // Get the secret from query params
    const secret = request.nextUrl.searchParams.get('secret')
    const path = request.nextUrl.searchParams.get('path')

    // Verify the secret to prevent unauthorized access
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or missing secret token',
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      )
    }

    // If a specific path is provided, revalidate only that path
    if (path) {
      revalidatePath(path)
      return NextResponse.json({
        success: true,
        message: `Revalidated path: ${path}`,
        path,
        timestamp: new Date().toISOString()
      })
    }

    // Otherwise, revalidate all main pages
    const paths = ['/', '/long-form', '/shorts']
    paths.forEach(p => revalidatePath(p))

    return NextResponse.json({
      success: true,
      message: 'Successfully revalidated all pages',
      paths,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error occurred during revalidation',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Optionally support GET for testing (remove in production for security)
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret. Use POST method with valid secret to revalidate.' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    message: 'Revalidation API is active. Use POST method to trigger revalidation.',
    usage: {
      method: 'POST',
      url: '/api/revalidate?secret=YOUR_SECRET_KEY',
      optionalParams: {
        path: 'Specific path to revalidate (e.g., /long-form)'
      }
    }
  })
}
