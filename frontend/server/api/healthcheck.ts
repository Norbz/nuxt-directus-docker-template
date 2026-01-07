export default defineEventHandler(async (event) => {
  try {
    // Get the Directus URL from runtime config
    const config = useRuntimeConfig()
    const directusUrl = config.public.directusUrl || process.env.NUXT_DIRECTUS_URL || 'http://directus:8055'
    
    // Try to fetch server info from Directus
    const response = await fetch(`${directusUrl}/server/info`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Directus server returned ${response.status}: ${response.statusText}`)
    }
    
    const info = await response.json()
    
    // Success response
    setResponseStatus(event, 200)
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      directus: {
        connected: true,
        project: info?.project?.project_name || 'Unknown'
      }
    }
    
  } catch (error) {
    // Error response
    setResponseStatus(event, 503)
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      directus: {
        connected: false
      }
    }
  }
})