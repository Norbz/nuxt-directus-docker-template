export default defineNuxtPlugin((nuxtApp) => {
    const route = useRoute();
    const isPreview = route.query.preview && route.query.preview === 'true';
    const version = route.query.version || 'main'
    if (isPreview) {
        
        nuxtApp.hook('page:finish', () => {
            refreshNuxtData();
        });
    }

    return { provide: { isPreview, previewToken: route.query.auth_token, previewVersion: version } };
});