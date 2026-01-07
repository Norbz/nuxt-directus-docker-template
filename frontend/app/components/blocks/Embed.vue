<template>
  <div class="block-embed" :data-directus="setAttr({collection: 'block_embed', item: id, fields: 'tagline, headline, embed_code, width, height', mode: 'drawer' })">
    <div class="container">
      <div v-if="tagline" class="tagline">{{ tagline }}</div>
      <h2 v-if="headline" class="headline">{{ headline }}</h2>
      <div 
        class="embed-container"
        :class="widthClass"
        :style="heightStyle"
        v-html="embedCode"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { setAttr } from '@directus/visual-editing'
import { computed } from 'vue'

const props = defineProps<{
  id: string | number
  name: string
  embed_code: string
  headline?: string
  tagline?: string
  width?: 'full' | 'wide' | 'normal'
  height?: number
}>()

const widthClass = computed(() => {
  return props.width ? `width-${props.width}` : 'width-normal'
})

const heightStyle = computed(() => {
  return props.height ? { height: `${props.height}px` } : {}
})

const embedCode = computed(() => props.embed_code)
</script>

<style>
/* Basic styling only, add more styling as needed */
.embed-container {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.width-full {
  width: 100%;
}

.width-wide {
  width: 90%;
  margin: 0 auto;
}

.width-normal {
  width: 80%;
  margin: 0 auto;
}

/* Ensure iframe fills the container */
.embed-container iframe {
  width: 100%;
  border: 0;
}
</style>