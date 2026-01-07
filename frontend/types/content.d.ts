/**
 * Type definitions for content fetching composables
 */

/**
 * Redirect information returned by the API
 */
export interface ContentRedirect {
  destination: string
  statusCode: number
}

/**
 * Response that can contain either content data or a redirect
 */
export interface ContentResponse<T> {
  data?: T
  redirect?: ContentRedirect
}

/**
 * Options for fetching content
 */
export interface ContentOptions {
  /** Collection name to fetch from (e.g., 'pages', 'posts') */
  collection: string
  /** Filter to apply to the query */
  filter: Record<string, any>
  /** Fields to fetch from the API */
  fields: string[]
  /** Cache key prefix for the content */
  cacheKeyPrefix?: string
}

/**
 * Result from useContent composable
 */
export interface ContentResult<T> {
  /** Reactive content data */
  data: Ref<T | null>
  /** Error if any occurred during fetch */
  error: Ref<any>
}
