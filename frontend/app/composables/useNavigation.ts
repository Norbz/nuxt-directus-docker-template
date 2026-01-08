import type { ContentResult } from '../../types/content';
import type { Navigation, NavigationItem } from '@/types/directus';

/**
 * Mapped navigation menu item for frontend use
 */
export interface NavigationMenuItem {
  id: string | number;
  url?: string;
  label?: string;
  to?: string;
  page?: {
    permalink?: string;
  };
  children?: NavigationMenuItem[];
}

/**
 * Extended navigation result with mapped items
 */
export interface NavigationResult extends Omit<Navigation, 'items'> {
  items?: NavigationMenuItem[];
}

/**
 * Maps a NavigationItem to NavigationMenuItem for frontend use
 */
function mapNavigationItem(item: NavigationItem): NavigationMenuItem {
  return {
    id: item.id,
    label: item.title,
    to: item.url || item.page?.permalink || undefined,
    children: item.children ? item.children.map(mapNavigationItem) : undefined
  }
}

/**
 * Composable for fetching navigation data from Directus
 * Uses the /api/_directus proxy for caching and shadowing in production
 * 
 * @param navigationId - The ID of the navigation to fetch (e.g., 'main')
 * @returns ContentResult with mapped navigation data and error refs
 */
export const useNavigation = async (
  navigationId: string = 'main'
): Promise<ContentResult<NavigationResult>> => {
  // Create a unique cache key
  const key = `navigation-${navigationId}`

  const { data, error } = await useAsyncData(key, async () => {
    try {
      // Use the _directus proxy for caching and production shadowing
      // Fetch specific navigation by ID
      const response = await $fetch(`/api/_directus/items/navigation/${navigationId}`, {
        query: {
          fields: ['*', 'items.*', 'items.page.title', 'items.page.permalink', 'items.post.title', 'items.post.slug', 'items.children.*']
        }
      })

      // The Directus API returns the single item directly when fetching by ID
      const navigation = response.data as Navigation
      
      // Map the navigation items for frontend use
      const mappedNavigation: NavigationResult = {
        ...navigation,
        items: navigation.items ? navigation.items.map(mapNavigationItem) : undefined
      }
      
      return mappedNavigation
    } catch (err: any) {
      // Re-throw the error so useAsyncData handles it properly
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.statusMessage || err.message || `Failed to fetch navigation ${navigationId}`
      })
    }
  })

  // Handle errors
  if (error.value) {
    console.error(`Error fetching navigation ${navigationId}:`, error.value)
    throw createError({
      statusCode: error.value.statusCode || 404,
      statusMessage: error.value.statusMessage || 'Navigation not found',
      fatal: false
    })
  }

  return { data: data as Ref<NavigationResult | null>, error }
}