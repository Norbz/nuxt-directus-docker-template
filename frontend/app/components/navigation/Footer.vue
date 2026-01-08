<script setup lang="ts">
const { data: navigationData } = await useNavigation('main')
</script>

<template>
  <footer class="site-footer">
    <div class="footer-copyright">
      <p>Copyright © {{ new Date().getFullYear() }}</p>
    </div>

    <nav class="footer-nav">
      <ul>
        <li v-for="item in navigationData?.items" :key="item.id">
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
