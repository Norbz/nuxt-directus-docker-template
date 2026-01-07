import { readItems, withToken } from '@directus/sdk';

/**
 * Composable for fetching page content in live preview mode
 * Handles authentication and fetching data via Directus SDK with preview token
 */
export const useLivePreviewPage = () => {
  const { $previewToken } = useNuxtApp()
  const directus = useDirectus()
  const route = useRoute()

  /**
   * Fetches page content in preview mode using Directus SDK
   * 
   * @param permalink - The permalink to fetch
   * @param fields - Array of fields to fetch
   * @returns The page data or null
   */
  const fetchPreviewPage = async (permalink: string, fields: string[]): Promise<Page | null> => {
    const queryOptions = {
      fields,
      filter: { permalink: { _eq: permalink } },
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
    console.log('  -> Fetching page in preview mode for permalink:', permalink, "with token:", token)

    let items
    try {
      if (token) {
        items = await directus.request(withToken(token, readItems('pages', queryOptions)))
      } else {
        items = await directus.request(readItems('pages', queryOptions))
      }
    } catch (err: any) {
      console.error('Error fetching page in preview mode:', err)
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.statusMessage || err.message || 'Failed to fetch page in preview mode'
      })
    }

    if (!items || items.length === 0) {
      throw createError({ 
        statusCode: 404, 
        message: '⚠️  Page not found in preview mode' 
      })
    }

    return items[0] as Page
  }

  return {
    fetchPreviewPage
  }
}
