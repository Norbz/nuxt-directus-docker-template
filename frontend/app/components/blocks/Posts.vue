<template>
  <div class="posts-block" :data-directus="setAttr({ collection: 'block_posts', item: id, fields: 'headline, tagline, collection, limit', mode: 'drawer' })">
    <div v-if="headline || tagline" class="posts-header">
      <p v-if="tagline" class="tagline">{{ tagline }}</p>
      <h2 v-if="headline" class="headline">{{ headline }}</h2>
    </div>
    
    <div v-if="posts && posts.length > 0" class="posts-grid">
      <article v-for="post in posts" :key="post.id" class="post-card">
        <NuxtLink :to="`/posts/${post.slug}`" class="post-link">
          <img v-if="post.image?.id" :src="`/api/_directus/assets/${post.image.id}?width=400&height=225&fit=cover`" :alt="post.title" class="post-image" />
          <div class="post-content">
            <h3 class="post-title">{{ post.title }}</h3>
            <p v-if="post.description" class="post-description">{{ post.description }}</p>
            <div class="post-footer">
              <span v-if="post.published_at" class="post-date">
                {{ formatDate(post.published_at) }}
              </span>
              <span class="read-more">Read more →</span>
            </div>
          </div>
        </NuxtLink>
      </article>
    </div>
    <div v-else class="loading">
      <p>Loading posts...</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.posts-block {
  padding: 2rem;
}

.posts-header {
  text-align: center;
  margin-bottom: 2rem;
}

.tagline {
  font-size: 0.875rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.headline {
  font-size: 2rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.post-card {
  border: 1px solid;
}

.post-link {
  text-decoration: none;
  display: block;
}

.post-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.post-content {
  padding: 1rem;
}

.post-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.post-description {
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-date {
  font-size: 0.75rem;
}

.read-more {
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 2rem;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { setAttr } from '@directus/visual-editing'
import {readItems} from '@directus/sdk'

// Define type for posts
interface Post {
  id: string | number;
  title: string;
  slug: string;
  description?: string;
  published_at?: string;
  image?: {
    id: string;
  };
  author?: {
    first_name?: string;
    last_name?: string;
  };
}

const props = defineProps<{
  id: string,
  headline?: string
  tagline?: string
  collection: string
  limit?: number
}>()

const { $isPreview, $previewToken, $previewVersion } = useNuxtApp()
const posts = ref<Post[]>([])
const loading = ref(true)

const directus = useDirectus();

// Format date helper function
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Fetch posts using direct fetch API
try {
  const {data} = await useAsyncData('fetch-posts', () => 
    directus.request(readItems(props.collection, {
      fields: ['*.*'],
      sort: '-published_at',
      limit: props.limit || 3,
      // filter: {
      //   published_at: {
      //     _lte: new Date().toISOString()
      //   }
      // }
    }))
  )

  if (data.value && Array.isArray(data.value) && data.value.length > 0) {
    posts.value = data.value as unknown as Post[]
    loading.value = false
  } else {
    loading.value = false
  }
} catch (error) {
  console.error('Error fetching posts:', error)
}
</script>