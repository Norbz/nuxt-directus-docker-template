import { 
  BlocksHero, 
  BlocksRichText, 
  BlocksGallery, 
  BlocksPricing, 
  BlocksForm, 
  BlocksIframe,
  BlocksEmbed
} from '#components'
import BlocksPosts from '@/components/blocks/Posts.vue'

/**
 * Composable that provides a function to map Directus collection names to Vue components
 * 
 * @returns {Function} A function that takes a collection name and returns the corresponding component
 */
export function useBlockComponents() {
  /**
   * Maps a Directus collection name to the corresponding Vue component
   * 
   * @param {string} collectionName - The name of the collection in Directus
   * @returns {Component} The Vue component to render for this block type
   */
  const blockToComponent = (collectionName: string) => {
    switch (collectionName) {
      case 'block_hero':
        return BlocksHero
      case 'block_richtext':
        return BlocksRichText
      case 'block_gallery':
        return BlocksGallery
      case 'block_pricing':
        return BlocksPricing
      case 'block_form':
        return BlocksForm
      case 'block_iframe':
        return BlocksIframe
      case 'block_posts':
        return BlocksPosts
      case 'block_embed':
        return BlocksEmbed
      default:
        return 'div'
    }
  }

  /**
   * Gets the field selectors needed for each block type
   * This helps with the Directus query to fetch the right fields
   * 
   * @returns {Object} An object mapping collection names to arrays of field selectors
   */
  const getBlockFields = () => {
    return {
      'block_hero': ['id', 'image.*', 'button_group.buttons.*', 'tagline', 'headline', 'description', 'layout'],
      'block_richtext': ['id', 'tagline', 'headline', 'content', 'alignment'],
      'block_gallery': ['id', 'items.*', 'tagline', 'headline'],
      'block_pricing': ['id', 'pricing_cards.*', 'pricing_cards.button.*', 'tagline', 'headline'],
      'block_form': ['id', 'form.*', 'form.fields.*', 'tagline', 'headline'],
      'block_iframe': ['id', 'name', 'url'],
      'block_posts': ['id', 'headline', 'tagline', 'collection', 'limit'],
      'block_embed': ['id', 'name', 'embed_code', 'tagline', 'headline', 'width', 'height']
    }
  }

  /**
   * Generates a fields array for Directus queries, including specific fields for each block type
   * 
   * @returns {Array} An array of field selectors for Directus queries
   */
  const generateFieldsArray = () => {
    const baseFields = ['id', 'title', 'permalink', 'published_at', 'seo', 'blocks.collection', 'blocks.item']
    const fieldsArray = [...baseFields] as any[]
    
    // Add specific fields for each block type
    Object.entries(getBlockFields()).forEach(([collection, fields]) => {
      fields.forEach(field => {
        fieldsArray.push(`blocks.item:${collection}.${field}`)
      })
    })

    return fieldsArray
  }

  return {
    blockToComponent,
    getBlockFields,
    generateFieldsArray
  }
}