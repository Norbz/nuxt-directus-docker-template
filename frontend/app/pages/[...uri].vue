<script setup>
import { useBlockComponents } from '@/composables/useBlockComponents'
import { usePage } from '@/composables/usePage'
import { useVisualEditor } from '@/composables/useVisualEditor'

const { blockToComponent } = useBlockComponents()

// Fetch the page data
const { data: page } = await usePage()

// Set up visual editor (handles onMounted internally)
useVisualEditor()
</script>

<template>
  <section class="page-container">
    <div v-if="page" class="page-content">
      <Head>
        <Title>{{ page.seo?.title || undefined }}</Title>
        <Meta name="description" :content="page.seo?.meta_description || ''" />
      </Head>
      <h1 class="page-title">{{ page.title }}</h1>
      <div v-if="page.blocks && Array.isArray(page.blocks)" v-for="block in page.blocks" :key="typeof block === 'string' ? block : block.id" class="block">
        <component 
          v-if="typeof block !== 'string' && block.collection" 
          :is="blockToComponent(block.collection)" 
          v-bind="{ ...block.item, id: block.id }"
        />
      </div>
    </div>
    <div v-else class="loading">Loading...</div>
  </section>
</template>

<style lang="scss" scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.block {
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
}
</style>
