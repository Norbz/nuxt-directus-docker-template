import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const directusUrl = config.directusUrl
  
  // Get the path after /api/_directus
  const path = event.path.replace(/^\/api\/_directus/, '')
  const target = joinURL(directusUrl, path)

  // proxyRequest returns a Promise<void> or the response object which might be complex
  // We should just return the result of proxyRequest directly, but ensure we don't try to cache the response object itself if it's a stream
  return proxyRequest(event, target)
})
