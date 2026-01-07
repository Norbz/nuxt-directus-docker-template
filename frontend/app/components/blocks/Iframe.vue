<template>
  <div class="iframe-container">
    <iframe 
      :src="url" 
      :title="name || 'Embedded content'"
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen
      loading="lazy"
      class="responsive-iframe"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
/**
 * Iframe component that displays an embedded iframe from an external source
 * 
 * @prop {string} url - The URL to embed in the iframe
 * @prop {string} name - The name/title of the iframe content
 */
defineProps<{
  id: string;
  url: string;
  name?: string;
}>();
</script>

<style scoped>
.iframe-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
}

.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>