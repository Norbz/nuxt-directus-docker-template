import { defineEventHandler, getQuery, createError } from 'h3'
import { fetchPageByPermalink, fetchRedirects, findRedirect } from './pages-utils'

/**
 * API endpoint handler
 * Caching is configured via routeRules in nuxt.config.ts
 */
export default defineEventHandler(async (event) => {
  // Get query parameters
  const query = getQuery(event)
  const permalink = query.permalink as string
  const fields = (query.fields as string || '').split(',').filter(Boolean)
  const skipRedirectCheck = query.skipRedirectCheck === 'true'
  
  if (!permalink) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing permalink parameter',
    })
  }

  // Normalize permalink (ensure it starts with /)
  const normalizedPermalink = permalink.startsWith('/') ? permalink : `/${permalink}`
  
  // Check for redirects (unless explicitly skipped)
  if (!skipRedirectCheck) {
    const redirects = await fetchRedirects(event)
    const redirect = findRedirect(redirects, normalizedPermalink)
    
    if (redirect) {
      // Return redirect information
      return {
        redirect: {
          destination: redirect.url_to,
          statusCode: parseInt(redirect.response_code),
          source: redirect.url_from
        }
      }
    }
  }
  
  // Default fields if none provided
  const defaultFields = [
    'id', 
    'title', 
    'permalink', 
    'published_at', 
    'seo', 
    'blocks.collection', 
    'blocks.item'
  ]
  
  const fieldsToFetch = fields.length > 0 ? fields : defaultFields
  
  // Fetch the page
  const page = await fetchPageByPermalink(event, normalizedPermalink, fieldsToFetch)
  
  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found',
    })
  }
  
  return {
    data: page
  }
})