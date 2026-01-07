<template>
  <div class="hello-world">
    <div class="container">
      <h1>Backend Healthcheck</h1>
      
      <div class="status-card">
        <h2>Connection Status</h2>
        <div v-if="loading" class="status loading">
          <span class="spinner"></span>
          Connecting to Directus...
        </div>
        <div v-else-if="error" class="status error">
          <span class="icon">❌</span>
          <p>Error: {{ error }}</p>
        </div>
        <div v-else class="status success">
          <span class="icon">✅</span>
          <p>Successfully connected to Directus!</p>
          <div class="details">
            <p><strong>Server URL:</strong> {{ directusUrl }}</p>
            <p v-if="serverInfo?.project?.project_name"><strong>Project:</strong> {{ serverInfo.project.project_name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const directusUrl = ref('')
const loading = ref(true)
const error = ref(null)
const serverInfo = ref(null)

onMounted(async () => {
  try {
    directusUrl.value = '/api/_directus'
    
    const directus = useDirectus()
    
    // Try to fetch server info using Directus SDK
    try {
      const info = await directus.request(() => ({
        method: 'GET',
        path: '/server/info'
      }))
      serverInfo.value = info
    } catch (e) {
      console.log('Could not fetch server info:', e)
    }
    
    loading.value = false
  } catch (e) {
    error.value = e.message
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
$primary-color: #4f46e5;
$success-color: #10b981;
$error-color: #ef4444;
$background: #0f172a;
$card-background: #1e293b;
$text-primary: #f1f5f9;
$text-secondary: #94a3b8;

.hello-world {
  min-height: 100vh;
  background: $background;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.container {
  max-width: 600px;
  width: 100%;
  text-align: center;
  
  h1 {
    color: $text-primary;
    font-size: 3rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, $primary-color, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .subtitle {
    color: $text-secondary;
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }
}

.status-card {
  background: $card-background;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  
  h2 {
    color: $text-primary;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  &.loading {
    color: $text-secondary;
  }
  
  &.success {
    color: $success-color;
    
    p {
      color: $text-primary;
      margin: 0;
    }
  }
  
  &.error {
    color: $error-color;
    
    p {
      color: $text-primary;
      margin: 0;
    }
  }
  
  .icon {
    font-size: 3rem;
  }
  
  .spinner {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border: 3px solid $text-secondary;
    border-top-color: $primary-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.details {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  text-align: left;
  
  p {
    color: $text-secondary;
    margin: 0.5rem 0;
    font-size: 0.875rem;
    
    strong {
      color: $text-primary;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
