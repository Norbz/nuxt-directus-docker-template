// https://nuxt.com/docs/api/configuration/nuxt-config
console.log(process.env.NITRO_REDIS_URL ? `Using Redis cache at ${process.env.NITRO_REDIS_URL}` : 'Using in-memory cache')
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/image'],
  css: ['~/assets/scss/main.scss'],

  image: {
    directus: {
      // This URL needs to include the final `assets/` directory
      baseURL: `/api/_directus/assets`
    }
  },

  runtimeConfig: {
    directusUrl: import.meta.env.NUXT_DIRECTUS_URL || 'http://localhost:8055',
    public: {
      directusUrl: import.meta.env.NUXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055',
    }
  },
  routeRules: {
    "/api/_directus/**": {
      // proxy: handled by server/api/_directus/[...].ts for runtime config support
      // cache: {
      //   maxAge: 60 * 60, // 1 hour
      //   swr: true,
      // },
    },
    "/api/pages": {
      cache: process.env.NODE_ENV === 'development' ? {
        maxAge: 1,
        swr: false,
      } : {
        maxAge: 60*15, // 15 minutes
        swr: true,
      },
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/scss/partials/core" as * with ($is-dev: ${process.env.NODE_ENV === 'development'});`,
        },
      },
    },
  },

  nitro: {
    // storage: process.env.NITRO_REDIS_URL ? {
    //   cache: {
    //     driver: 'redis',
    //     url: process.env.NITRO_REDIS_URL,
    //   },
    // } : undefined,
     devStorage: {
      cache: {
        driver: 'memory',
      }
    }
  },
})