<script setup lang="ts">
import { readItems } from '@directus/sdk'

const directus = useDirectus()

const { data, error } = await useAsyncData('navigation-footer', async () => {
    return directus.request(readItems('navigation', {
        fields: ['id', 'title', 'items.*.*', 'items.children.*.*'],
        filter: { id: { _eq: 'footer' } },
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
  <footer class="site-footer">
    <div class="footer-copyright">
      <p>Copyright © {{ new Date().getFullYear() }}</p>
    </div>

    <nav class="footer-nav">
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

    <div class="footer-social">
      <Icon name="i-simple-icons-discord" />
      <Icon name="i-simple-icons-x" />
      <Icon name="i-simple-icons-github" />
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.site-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-top: 1px solid;
}

.footer-copyright {
  p {
    font-size: 0.875rem;
  }
}

.footer-nav {
  ul {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  a {
    text-decoration: none;
  }
}

.footer-social {
  display: flex;
  gap: 1rem;
}
</style>
