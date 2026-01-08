import type { ContentResult } from '../../types/content';
import type { Page } from '@/types/directus';
import { useLivePreviewPage } from './useLivePreviewPage';
import { useBlockComponents } from './useBlockComponents';

/**
 * Composable for fetching page data
 * Handles both live mode (via API with redirects) and preview mode (via Directus SDK)
 * Manages redirects internally and returns only page data and error
 */
export const usePage = async (): Promise<ContentResult<Page>> => {
  const { $isPreview } = useNuxtApp()
  const { fetchPreviewPage } = useLivePreviewPage()
  const { generateFieldsArray } = useBlockComponents()
  const route = useRoute()

  // Compute the permalink from the route params
  const permalink = computed(() => {
    const uri = route.params.uri
    return Array.isArray(uri) ? `/${uri.join('/')}` : `/${uri || ''}`
  })

  const fields = generateFieldsArray()
  
  // Create a unique cache key based on permalink and mode
  const key = `page-${permalink.value}-${$isPreview ? 'preview' : 'live'}`

  const { data, error } = await useAsyncData(key, async () => {
    if ($isPreview) {
      // Preview Mode: Use Directus SDK directly with the preview token
      return await fetchPreviewPage(permalink.value, fields)
    } else {
      // Live Mode: Use our API endpoint which handles redirects and caching
      try {
        const response = await $fetch('/api/pages', {
          params: {
            permalink: permalink.value,
            fields: fields.join(',')
          }
        })

        // Handle redirects returned by the API
        if ('redirect' in response && response.redirect) {
          const { destination, statusCode } = response.redirect
          await navigateTo(destination, { 
            redirectCode: statusCode, 
            external: destination.startsWith('http') 
          })
          return null
        }

        // Return data if present, otherwise return the response
        return 'data' in response ? response.data : response
      } catch (err: any) {
        // Re-throw the error so useAsyncData handles it properly
        throw createError({
          statusCode: err.statusCode || 500,
          statusMessage: err.statusMessage || err.message || 'Failed to fetch page'
        })
      }
    }
  })

  // Handle errors
  if (error.value) {
    console.error('Error fetching page:', error.value)
    throw createError({
      statusCode: error.value.statusCode || 404,
      statusMessage: error.value.statusMessage || 'Page not found',
      fatal: true
    })
  }

  return { data: data as Ref<Page | null>, error }
}
