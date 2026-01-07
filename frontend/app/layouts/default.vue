<script setup lang="ts">

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