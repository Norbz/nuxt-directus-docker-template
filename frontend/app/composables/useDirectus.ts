import { createDirectus, rest, authentication, readMe } from '@directus/sdk'
export const useDirectus = () => {
  // Use full URL for Directus SDK (required by SDK)
  // Client-side: use window.location.origin + proxy path
  // Server-side: use internal Directus URL
  const directusUrl = import.meta.server 
    ? (useRuntimeConfig().directusUrl || 'http://localhost:8055')
    : `${window.location.origin}/api/_directus`
  console.log('✅ Initializing Directus SDK with URL:', directusUrl);
  const client = createDirectus(directusUrl)
                  .with(authentication('cookie', { credentials: 'include' }))
                  .with(rest({ credentials: 'include' }));
  
  return client
}