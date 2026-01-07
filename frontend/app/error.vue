<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="error-page">
    <div class="error-container">
      <h1 class="error-code">
        {{ error?.statusCode || '500' }}
      </h1>
      <p class="error-message">
        {{ error?.statusMessage || 'An error occurred' }}
      </p>
      <button @click="handleError" class="back-button">
        Go back home
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-container {
  text-align: center;
  padding: 2rem;
}

.error-code {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.back-button {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
}
</style>
