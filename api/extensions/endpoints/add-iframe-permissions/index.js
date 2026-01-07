// Script to add permissions for block_iframe to the public role
// Save this script and run it from your API directory

// Get the public role ID
const publicRoleId = 'd70780bd-f3ed-418b-98c2-f5354fd3fa68'; // This may need to be updated with the actual Public role ID

// Create permissions for block_iframe
export default async function({ services, exceptions, database }) {
  const { PermissionsService } = services;
  const { ForbiddenException } = exceptions;
  
  const permissionsService = new PermissionsService({
    accountability: {
      admin: true,
    },
    schema: await database.schema.snapshot(),
  });
  
  try {
    // Grant read permissions for block_iframe to the Public role
    await permissionsService.createOne({
      role: publicRoleId,
      collection: 'block_iframe',
      action: 'read',
      fields: ['*'],
      permissions: {},
      validation: {},
    });
    
    console.log('Successfully added permissions for block_iframe to the Public role');
    return { success: true };
  } catch (error) {
    console.error('Error adding permissions:', error);
    throw new ForbiddenException();
  }
}