<script setup lang="ts">
import { setAttr } from '@directus/visual-editing'

type GalleryItem = {
    id: string;
    block_gallery: string;
    directus_file: string;
    sort: number;
}

const props = defineProps<{
  id: string
  tagline: string
  headline: string
  items: GalleryItem[]
}>()

</script>

<template>
  <div class="gallery-block">
    <BlocksRichText
      :data-directus="setAttr({collection: 'block_gallery', item: id, fields: 'tagline, headline', mode: 'drawer' })"
      :id="id"
      :tagline="tagline"
      :headline="headline"
      :content="''"
      alignment="center"
    />
    <ul class="gallery-grid" :data-directus="setAttr({collection: 'block_gallery', item: id, fields: 'items', mode: 'popover' })">
      <li v-for="item in items" :key="item.id" class="gallery-item">
        <img :src="`/api/_directus/assets/${item.directus_file}`" :alt="'Gallery image'" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.gallery-block {
  padding: 2rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(234px, 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

.gallery-item {
  img {
    width: 100%;
    height: 234px;
    object-fit: cover;
  }
}
</style>
