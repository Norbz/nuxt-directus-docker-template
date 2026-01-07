<script setup lang="ts">
import { readItems } from '@directus/sdk'

const directus = useDirectus()

const { data, error } = await useAsyncData('navigation-header', async () => {
    return directus.request(readItems('navigation', {
        fields: ['id', 'title', 'items.*.*', 'items.children.*.*'],
        filter: { id: { _eq: 'main' } },
        limit: 1,
    }))
})

type NavigationMenuItem = {
    id: string | number;
    url?: string;
    label?: string;
    to?: string;
    page?: {
        permalink?: string;
    };
    children?: NavigationMenuItem[];
}

const items: ComputedRef<NavigationMenuItem[]> = computed(() => {
    if (!data.value || !data.value[0]?.items) return []
    
    function mapItem(item: NavigationItem): NavigationMenuItem {
        return {
            id: item.id,
            label: item.title,
            to: item.url || item.page?.permalink || undefined,
            children: item.children ? item.children.map(mapItem) : undefined
        }
    }
    
    return data.value[0].items.map(mapItem)
})
</script>
<template>
  <header class="site-header">
    <div class="header-title">Proto website</div>
    <nav class="main-nav">
      <ul>
        <li v-for="item in items" :key="item.id">
          <NuxtLink v-if="item.to" :to="item.to">
            {{ item.label }}
          </NuxtLink>
          <span v-else>
            {{ item.label }}
          </span>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.main-nav {
  ul {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  li {
    
  }
  
  a {
    text-decoration: none;
  }
}
</style>
