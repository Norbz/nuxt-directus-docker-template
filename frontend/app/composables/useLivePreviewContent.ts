import { readItems, withToken } from '@directus/sdk';
import type { ContentOptions } from '../../types/content';

/**
 * Composable for fetching content in live preview mode
 * Handles authentication and fetching data via Directus SDK with preview token
 */
export const useLivePreviewContent = () => {
  const { $previewToken } = useNuxtApp()
  const directus = useDirectus()
  const route = useRoute()

  /**
   * Fetches content in preview mode using Directus SDK
   * 
   * @param options - Content fetching options including collection, filter, and fields
   * @returns The first item from the collection or null
   */
  const fetchPreviewContent = async <T>(options: ContentOptions): Promise<T | null> => {
    const { collection, filter, fields } = options

    const queryOptions = {
      fields,
      filter,
      limit: 1,
    }

    // Handle authentication via query parameters if provided
    if (route.query.email && route.query.password) {
      await directus.login({
        email: decodeURIComponent(route.query.email.toString()),
        password: decodeURIComponent(route.query.password.toString()),
      }, { mode: 'cookie' })

      console.log("🔐 Logged in to Directus SDK for preview with email:", route.query.email)
    }

    const token = await directus.getToken() || $previewToken?.toString() || null
    console.log(`  -> Fetching ${collection} in preview mode with token:`, token)

    let items
    try {
      if (token) {
        items = await directus.request(withToken(token, readItems(collection, queryOptions)))
      } else {
        items = await directus.request(readItems(collection, queryOptions))
      }
    } catch (err: any) {
      console.error(`Error fetching ${collection} in preview mode:`, err)
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.statusMessage || err.message || `Failed to fetch ${collection} in preview mode`
      })
    }

    if (!items || items.length === 0) {
      throw createError({ 
        statusCode: 404, 
        message: `⚠️  ${collection} not found in preview mode` 
      })
    }

    return items[0] as T
  }

  return {
    fetchPreviewContent
  }
}
