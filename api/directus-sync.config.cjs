/**
 * Directus Sync Configuration
 * 
 * This configuration file provides hooks to dynamically replace localhost URLs
 * with the FRONTEND_PUBLIC_URL environment variable in preview_url fields.
 */

const FRONTEND_PUBLIC_URL = process.env.FRONTEND_PUBLIC_URL || 'http://localhost:3000';
const VISUAL_EDITOR_TOKEN = process.env.VISUAL_EDITOR_TOKEN || '';
const LOCALHOST_URL = 'http://localhost:3000';
const TOKEN_PLACEHOLDER = '{{VISUAL_EDITOR_TOKEN}}';

console.log('[directus-sync.config] Initializing with FRONTEND_PUBLIC_URL:', FRONTEND_PUBLIC_URL);
console.log('[directus-sync.config] VISUAL_EDITOR_TOKEN is', VISUAL_EDITOR_TOKEN ? 'set' : 'not set');

/**
 * Replace any URL with localhost (for normalizing before saving to git)
 * Also masks the auth_token with a placeholder
 * @param {string|null} previewUrl - The preview URL to transform
 * @returns {string|null} - The normalized URL or null
 */
function normalizeToLocalhost(previewUrl) {
  if (!previewUrl || typeof previewUrl !== 'string') {
    return previewUrl;
  }
  
  // Match http://domain:port or https://domain:port (domain can contain letters, numbers, dots, hyphens, and colons)
  const urlPattern = /^https?:\/\/[a-zA-Z0-9\.\-:]+/;
  const match = previewUrl.match(urlPattern);
  
  let newUrl = previewUrl;
  
  if (match && match[0] !== LOCALHOST_URL) {
    newUrl = previewUrl.replace(urlPattern, LOCALHOST_URL);
  }
  
  // Mask the auth_token with placeholder
  const tokenPattern = /([?&]auth_token=)([^&]+)/;
  if (tokenPattern.test(newUrl)) {
    newUrl = newUrl.replace(tokenPattern, `$1${TOKEN_PLACEHOLDER}`);
    console.log('[directus-sync.config] Masking auth_token:');
    console.log('  FROM:', previewUrl);
    console.log('  TO  :', newUrl);
  } else if (newUrl !== previewUrl) {
    console.log('[directus-sync.config] Normalizing to localhost:');
    console.log('  FROM:', previewUrl);
    console.log('  TO  :', newUrl);
  }
  
  return newUrl;
}

/**
 * Replace localhost with the environment's frontend URL (for pushing to Directus)
 * Also injects the VISUAL_EDITOR_TOKEN if set, or leaves empty if not
 * @param {string|null} previewUrl - The preview URL to transform
 * @returns {string|null} - The transformed URL or null
 */
function injectFrontendUrl(previewUrl) {
  if (!previewUrl || typeof previewUrl !== 'string') {
    return previewUrl;
  }
  
  let newUrl = previewUrl;
  let wasModified = false;
  
  // Replace localhost with environment URL
  if (newUrl.startsWith(LOCALHOST_URL) && FRONTEND_PUBLIC_URL !== LOCALHOST_URL) {
    newUrl = newUrl.replace(LOCALHOST_URL, FRONTEND_PUBLIC_URL);
    wasModified = true;
  }
  
  // Replace token placeholder with actual token or empty string
  const tokenPattern = new RegExp(`([?&]auth_token=)${TOKEN_PLACEHOLDER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  if (tokenPattern.test(newUrl)) {
    newUrl = newUrl.replace(tokenPattern, `$1${VISUAL_EDITOR_TOKEN}`);
    wasModified = true;
  }
  
  if (wasModified) {
    console.log('[directus-sync.config] Injecting environment URL and token:');
    console.log('  FROM:', previewUrl);
    console.log('  TO  :', newUrl);
  }
  
  return newUrl;
}

module.exports = {
  hooks: {
    /**
     * Settings collection hooks - for visual editor URLs
     */
    settings: {
      /**
       * onSave: Executed during 'pull' command, before saving to files
       * Normalizes URLs to localhost for git
       */
      onSave: async (settings, client) => {
        console.log('[directus-sync.config] Executing settings.onSave hook');
        
        if (Array.isArray(settings) && settings.length > 0) {
          const settingsItem = settings[0];
          
          // Process visual_editor_urls array
          if (settingsItem && Array.isArray(settingsItem.visual_editor_urls)) {
            let modifiedCount = 0;
            settingsItem.visual_editor_urls = settingsItem.visual_editor_urls.map((urlObj) => {
              if (urlObj && urlObj.url) {
                const originalUrl = urlObj.url;
                urlObj.url = normalizeToLocalhost(originalUrl);
                
                if (originalUrl !== urlObj.url) {
                  modifiedCount++;
                }
              }
              return urlObj;
            });
            
            if (modifiedCount > 0) {
              console.log(`[directus-sync.config]   ✓ Normalized ${modifiedCount} visual editor URL(s)`);
            }
          }
        }
        
        console.log('[directus-sync.config] Settings.onSave completed');
        return settings;
      },

      /**
       * onLoad: Executed during 'push' command, after loading from files
       * Injects the environment's FRONTEND_PUBLIC_URL
       */
      onLoad: async (settings, client) => {
        console.log('[directus-sync.config] Executing settings.onLoad hook');
        
        if (Array.isArray(settings) && settings.length > 0) {
          const settingsItem = settings[0];
          
          // Process visual_editor_urls array
          if (settingsItem && Array.isArray(settingsItem.visual_editor_urls)) {
            let modifiedCount = 0;
            settingsItem.visual_editor_urls = settingsItem.visual_editor_urls.map((urlObj) => {
              if (urlObj && urlObj.url) {
                const originalUrl = urlObj.url;
                urlObj.url = injectFrontendUrl(originalUrl);
                
                if (originalUrl !== urlObj.url) {
                  modifiedCount++;
                }
              }
              return urlObj;
            });
            
            if (modifiedCount > 0) {
              console.log(`[directus-sync.config]   ✓ Injected ${modifiedCount} visual editor URL(s)`);
            }
          }
        }
        
        console.log('[directus-sync.config] Settings.onLoad completed');
        return settings;
      }
    },

    /**
     * Snapshot hooks - executed when processing the entire schema snapshot
     */
    snapshot: {
      /**
       * onSave: Executed during 'pull' command, before saving to files
       * Normalizes URLs to localhost for git
       */
      onSave: async (snapshot, client) => {
        console.log('[directus-sync.config] Executing snapshot.onSave hook');
        console.log('[directus-sync.config] Processing collections with preview_url...');
        
        let modifiedCount = 0;
        
        // Process each collection in the snapshot
        if (snapshot.collections) {
          snapshot.collections.forEach((collection) => {
            if (collection.meta && collection.meta.preview_url) {
              const originalUrl = collection.meta.preview_url;
              collection.meta.preview_url = normalizeToLocalhost(originalUrl);
              
              if (originalUrl !== collection.meta.preview_url) {
                modifiedCount++;
                console.log(`[directus-sync.config]   ✓ Normalized collection: ${collection.collection}`);
              }
            }
          });
        }
        
        console.log(`[directus-sync.config] Snapshot.onSave completed - Modified ${modifiedCount} collection(s)`);
        return snapshot;
      },

      /**
       * onLoad: Executed during 'push' and 'diff' commands, after loading from files
       * Injects the environment's FRONTEND_PUBLIC_URL
       */
      onLoad: async (snapshot, client) => {
        console.log('[directus-sync.config] Executing snapshot.onLoad hook');
        console.log('[directus-sync.config] Processing collections with preview_url...');
        
        let modifiedCount = 0;
        
        // Process each collection in the snapshot
        if (snapshot.collections) {
          snapshot.collections.forEach((collection) => {
            if (collection.meta && collection.meta.preview_url) {
              const originalUrl = collection.meta.preview_url;
              collection.meta.preview_url = injectFrontendUrl(originalUrl);
              
              if (originalUrl !== collection.meta.preview_url) {
                modifiedCount++;
                console.log(`[directus-sync.config]   ✓ Injected URL for collection: ${collection.collection}`);
              }
            }
          });
        }
        
        console.log(`[directus-sync.config] Snapshot.onLoad completed - Modified ${modifiedCount} collection(s)`);
        return snapshot;
      }
    }
  }
};
