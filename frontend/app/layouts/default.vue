<script setup lang="ts">
const { data: globals } = await useGlobals()

// Set global site title in head
useHead({
  title: globals.value?.title || undefined
})
</script>
<template>
  <div class="layout default-layout">
    <NavigationHeader></NavigationHeader>
    <main>
      <slot></slot>
    </main>
    <NavigationFooter></NavigationFooter>
  </div>
</template>
<style lang="scss" scoped>
  .layout {

  }
</style>