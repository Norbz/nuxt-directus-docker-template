<script setup lang="ts">
const { data: navigationData } = await useNavigation('main')
</script>
<template>
  <header class="site-header">
    <div class="header-title">Proto website</div>
    <nav class="main-nav">
      <ul>
        <li v-for="item in navigationData?.items || []" :key="item.id">
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
