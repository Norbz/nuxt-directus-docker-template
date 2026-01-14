import type { H3Event } from 'h3'
import { createError } from 'h3'

// Types
export interface Page {
  id: string
  title: string
  permalink: string
  status: string
  published_at: string
  seo: any
  blocks: any[]
}

// Types for redirects
export interface Redirect {
  id: string
  url_from: string
  url_to: string
  response_code: '301' | '302'
}

// Note: Caching is now handled by Nitro's cache layer with Redis in production

/**
 * Fetches redirects from Directus and caches them
 */
export async function fetchRedirects(event: H3Event): Promise<Redirect[]> {
  // Use runtime config to get internal Directus URL (server-side only)
  const config = useRuntimeConfig()
  const directusUrl = config.directusUrl || 'http://localhost:8055'
  
  try {
    // Fetch redirects from Directus
    // Note: The redirects collection might not have a status field, so we fetch all redirects
    const response = await fetch(`${directusUrl}/items/redirects?fields=id,url_from,url_to,response_code`)
    
    if (!response.ok) {
      console.error('Failed to fetch redirects:', response.statusText)
      return []
    }

    const result = await response.json()
    const redirects = result.data || []
    
    console.log(`Loaded ${redirects.length} redirects from Directus`)
    return redirects
  } catch (error) {
    console.error('Error fetching redirects:', error)
    return []
  }
}

/**
 * Find matching redirect for a given path
 */
export function findRedirect(redirects: Redirect[], path: string): Redirect | undefined {
  // Normalize path for comparison
  const normalizedPath = path.endsWith('/') && path !== '/' 
    ? path.slice(0, -1) 
    : path

  return redirects.find(redirect => {
    const redirectFrom = redirect.url_from.endsWith('/') && redirect.url_from !== '/' 
      ? redirect.url_from.slice(0, -1)
      : redirect.url_from
      
    return redirectFrom === normalizedPath
  })
}

/**
 * Fetch a page from Directus by permalink
 */
export async function fetchPageByPermalink(
  event: H3Event, 
  permalink: string, 
  fields: string[] = ['id', 'title', 'permalink']
): Promise<Page | null> {
  console.log(`Fetching page for ${permalink} from Directus`)

  // Use runtime config to get internal Directus URL (server-side only)
  const config = useRuntimeConfig()
  const directusUrl = config.directusUrl || 'http://localhost:8055'

  try {
    // Build the query
    const fieldsParam = fields.join(',')
    const url = new URL(`${directusUrl}/items/pages`)
    
    url.searchParams.append('fields', fieldsParam)
    url.searchParams.append('filter[permalink][_eq]', permalink)
    url.searchParams.append('filter[status][_eq]', 'published')
    url.searchParams.append('limit', '1')
    
    // Make the request
    const response = await fetch(url.toString())
    
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ errors: [{ message: response.statusText }] }))
      console.error(`Failed to fetch page for ${permalink}:`, errorBody)
      
      // Extract error details from Directus error response
      const errorMessage = errorBody.errors?.[0]?.message || response.statusText
      const errorReason = errorBody.errors?.[0]?.extensions?.reason
      
      throw createError({
        statusCode: response.status,
        statusMessage: errorMessage,
        message: errorReason || errorMessage,
        data: errorBody
      })
    }

    const result = await response.json()
    
    if (!result.data || !result.data.length) {
      console.log(`No published page found for permalink: ${permalink}`)
      return null
    }

    const page = result.data[0]
    
    return page
  } catch (error: any) {
    // Re-throw createError errors as-is
    if (error.statusCode) {
      throw error
    }
    
    // For other errors, log and throw with 500
    console.error(`Error fetching page for ${permalink}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error.message || 'Failed to fetch page'
    })
  }
}