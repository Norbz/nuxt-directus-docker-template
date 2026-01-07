<script setup lang="ts">
import { setAttr } from '@directus/visual-editing'

const props = defineProps<{
    id: string,
    tagline: string,
    headline: string,
    description?: string
    image: Image,
}>()

</script>
<template>
  <section
    class="hero"
    :data-directus="setAttr({ collection: 'block_hero', item: id, fields: 'tagline, headline, description, button_group, image', mode: 'drawer' })"
  >
    <div class="hero-content">
      <p class="tagline">{{ tagline }}</p>
      <h1 class="headline">{{ headline }}</h1>
      <p class="description">{{ description }}</p>
    </div>
    <div class="hero-image">
      <img :src="`/api/_directus/assets/${image.id}`" :alt="image.title || ''" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 2rem;
}

.hero-content {
  flex: 1;
}

.tagline {
  font-size: 0.875rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.headline {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.description {
  margin-bottom: 1rem;
}

.hero-image {
  flex: 1;
  
  img {
    width: 100%;
    height: auto;
  }
}
</style>
