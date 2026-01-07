
export default ({ action }, { services, getSchema }) => {
  console.log('[Permalinks Hook] Extension loaded');

  action('items.create', async (meta, context) => {
    const { collection, key, payload } = meta;
    const { database, schema, accountability } = context;
    
    console.log('[Permalinks Hook] Triggered for collection:', collection, 'key:', key, 'payload:', payload);

    // Use provided schema or getSchema fallback
    const currentSchema = schema || (await getSchema());
    
    // Check if this collection has a permalink field
    const collectionFields = currentSchema?.collections?.[collection]?.fields || {};
    const permalinkField = collectionFields['permalink'];
    
    console.log('[Permalinks Hook] Permalink field:', permalinkField);
    console.log('[Permalinks Hook] Field special:', permalinkField?.special);
    
    // Check if permalink field exists and is an integer (foreign key to permalinks)
    if (!permalinkField || permalinkField.type !== 'integer') {
      console.log('[Permalinks Hook] No permalink field or not integer type');
      return;
    }

    if (payload?.permalink) {
      console.log('[Permalinks Hook] Item already has a permalink, skipping.');
      return;
    }

    try {
      // Create the permalink entry using ItemsService
      const { ItemsService } = services;
      const permalinksService = new ItemsService('permalinks', {
        database,
        schema: currentSchema,
        accountability,
      });
      
      const permalinkData = {
        slug: payload?.slug || `${collection}-${key}`,
        collection,
        item_id: key,
      };
      
      console.log('[Permalinks Hook] Creating permalink:', permalinkData);
      const permalink = await permalinksService.createOne(permalinkData);
      console.log('[Permalinks Hook] Created permalink:', permalink);

      // Update the item with the new permalink id
      const itemService = new ItemsService(collection, {
        database,
        schema: currentSchema,
        accountability,
      });
      
      console.log('[Permalinks Hook] Updating item', key, 'with permalink', permalink);
      await itemService.updateOne(key, { permalink });
      console.log('[Permalinks Hook] Item updated with permalink');
    } catch (err) {
      console.error('[Permalinks Hook] Error in service logic:', err);
    }
  });
};