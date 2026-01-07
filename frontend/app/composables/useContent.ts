import { readItems } from '@directus/sdk';
import type { ContentResult } from '../../types/content';

/**
 * Generic composable for fetching content from any collection using Directus SDK
 * Simple and straightforward - no custom API routes, no redirects, just direct SDK access
 * 
 * @param collection - The name of the collection to fetch from (e.g., 'posts', 'products')
 * @param identifier - The identifier used to fetch the content
 * @param fields - Array of fields to fetch
 * @param filterField - The field name to filter by (defaults to 'id')
 * @returns ContentResult with data and error refs
 */
export const useContent = async <T>(
  collection: string,
  identifier: string | number,
  fields: string[],
  filterField: string = 'id'
): Promise<ContentResult<T>> => {
  const directus = useDirectus()

  // Create a unique cache key
  const key = `${collection}-${filterField}-${identifier}`

  const { data, error } = await useAsyncData(key, async () => {
    const queryOptions = {
      fields,
      filter: { [filterField]: { _eq: identifier } },
      limit: 1,
    }

    try {
      const items = await directus.request(readItems(collection, queryOptions))

      if (!items || items.length === 0) {
        throw createError({ 
          statusCode: 404, 
          message: `${collection} not found` 
        })
      }

      return items[0] as T
    } catch (err: any) {
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.statusMessage || err.message || `Failed to fetch ${collection}`
      })
    }
  })

  // Handle errors
  if (error.value) {
    console.error(`Error fetching ${collection}:`, error.value)
    throw createError({
      statusCode: error.value.statusCode || 404,
      statusMessage: error.value.statusMessage || `${collection} not found`,
      fatal: true
    })
  }

  return { data: data as Ref<T | null>, error }
}
