<script setup lang="ts">
import { setAttr } from '@directus/visual-editing'

defineProps<{
    id: string,
    tagline?: string,
    headline?: string,
    content: string,
    alignment: string
}>()
</script>
<template>
    <section
        :data-directus="setAttr({
            collection: 'block_richtext', item: id, fields: 'tagline, headline, content', mode: 'drawer'
        })">
            <h2>{{ headline }}</h2>
            <h3>{{ tagline }}</h3>
            <div v-html="content"></div>
    </section>
</template>

<style lang="scss" scoped>
section {
  padding: 2rem;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>
