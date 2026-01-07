import { apply } from '@directus/visual-editing'

/**
 * Composable for setting up the visual editor
 * Enables live visual editing when the visual_editing query parameter is present
 * Automatically sets up on mount
 */
export const useVisualEditor = () => {
  const route = useRoute()
  const config = useRuntimeConfig()

  onMounted(() => {
    if (route.query.visual_editing !== 'true') {
      return
    }

    console.log('Visual editing mode enabled', config.public.directusUrl)
    apply({ directusUrl: config.public.directusUrl })
  })
}
