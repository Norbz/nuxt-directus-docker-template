import type { ContentResult } from '../../types/content';
import type { Globals } from '@/types/directus';

/**
 * Composable for fetching global settings from Directus
 * Uses the /api/_directus proxy for caching and shadowing in production
 * Since globals is a singleton, it fetches the first (and only) item from the collection
 * 
 * @returns ContentResult with globals data and error refs
 */
export const useGlobals = async (): Promise<ContentResult<Globals>> => {
  // Create a unique cache key for globals
  const key = 'globals'

  const { data, error } = await useAsyncData(key, async () => {
    try {
      // Use the _directus proxy for caching and production shadowing
      // For singleton collections, we fetch the items collection and get the first item
      const response = await $fetch('/api/_directus/items/globals', {
        query: {
          fields: ['*', 'logo.*', 'logo_dark_mode.*', 'favicon.*'],
          limit: 1
        }
      })

      // Handle singleton response - globals collection returns the singleton directly
      const globals = response.data
      
      if (!globals) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Global settings not found'
        })
      }

      return globals as Globals
    } catch (err: any) {
      // Re-throw the error so useAsyncData handles it properly
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.statusMessage || err.message || 'Failed to fetch global settings'
      })
    }
  })

  // Handle errors
  if (error.value) {
    console.error('Error fetching global settings:', error.value)
    throw createError({
      statusCode: error.value.statusCode || 404,
      statusMessage: error.value.statusMessage || 'Global settings not found',
      fatal: true
    })
  }

  return { data: data as Ref<Globals | null>, error }
}