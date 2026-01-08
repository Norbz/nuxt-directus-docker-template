#!/usr/bin/env node

/**
 * Script to automatically scaffold Vue components for Directus block collections
 * 
 * This script:
 * 1. Reads TypeScript interfaces from app/types/directus.ts
 * 2. Identifies block collections (prefixed with 'Block*')
 * 3. Creates Vue components for missing block types
 * 4. Updates the useBlockComponents composable
 * 
 * Usage: 
 *   node scripts/scaffold-block-components.js           # Generate TypeScript components
 *   node scripts/scaffold-block-components.js --js      # Generate JavaScript components
 */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file
config({ path: path.join(__dirname, '..', '.env') })

// Parse command line arguments
const args = process.argv.slice(2)
const USE_JAVASCRIPT = args.includes('--js') || args.includes('--javascript')

// Configuration
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend')
const COMPONENTS_DIR = path.join(FRONTEND_DIR, 'app', 'components', 'blocks')
const COMPOSABLE_FILE = path.join(FRONTEND_DIR, 'app', 'composables', 'useBlockComponents.ts')
/**
 * Read and parse TypeScript interfaces from app/types/directus.ts
 */
async function readTypescriptInterfaces() {
  const typesFile = path.join(FRONTEND_DIR, 'app', 'types', 'directus.ts')
  
  try {
    const content = await fs.readFile(typesFile, 'utf8')
    const interfaces = {}
    
    // Extract interface definitions (handles both 'interface' and 'export interface')
    const interfaceRegex = /(?:export\s+)?interface\s+(\w+)\s*{([^{}]*(?:{[^}]*}[^{}]*)*)}/g
    let match
    
    while ((match = interfaceRegex.exec(content)) !== null) {
      const [, interfaceName, interfaceBody] = match
      
      // Extract field definitions from interface body
      const fields = {}
      const fieldRegex = /(?:\/\*\*[^*]*\*+(?:[^/*][^*]*\*+)*\/\s*)?(\w+)\?\s*:\s*([^;]+);/g
      let fieldMatch
      
      while ((fieldMatch = fieldRegex.exec(interfaceBody)) !== null) {
        const [, fieldName, fieldType] = fieldMatch
        // Skip metadata fields and system fields
        if (!fieldName.startsWith('date_') && !fieldName.startsWith('user_') && 
            !fieldName.startsWith('meta_') && fieldName !== 'sort' && fieldName !== 'id') {
          fields[fieldName] = fieldType.trim()
        }
      }
      
      interfaces[interfaceName] = {
        body: interfaceBody.trim(),
        fields
      }
    }
    
    return interfaces
  } catch (error) {
    console.log('⚠️  Could not read app/types/directus.ts, falling back to generic types')
    return {}
  }
}

/**
 * Extract block collections from TypeScript interfaces
 */
function getBlockCollectionsFromInterfaces(interfaces) {
  const blockCollections = []
  
  for (const [interfaceName, interfaceData] of Object.entries(interfaces)) {
    // Check if interface name starts with "Block" - include all block components
    if (interfaceName.startsWith('Block')) {
      // Convert interface name to collection name: BlockPricing -> block_pricing
      const collectionName = interfaceName
        .replace(/^Block/, 'block_')
        .replace(/([A-Z])/g, (match, letter, offset) => offset > 0 ? `_${letter.toLowerCase()}` : letter.toLowerCase())
      
      blockCollections.push({
        collection: collectionName,
        interface: interfaceName,
        fields: interfaceData.fields || {}
      })
    }
  }
  
  return blockCollections
}

/**
 * Check which components already exist
 */
async function getExistingComponents() {
  try {
    const files = await fs.readdir(COMPONENTS_DIR)
    return files
      .filter(file => file.endsWith('.vue'))
      .map(file => file.replace('.vue', '').toLowerCase()) // Convert to lowercase for comparison
  } catch (error) {
    console.error('❌ Failed to read components directory:', error.message)
    return []
  }
}

/**
 * Convert collection name to component name
 * e.g., 'block_hero' -> 'Hero'
 */
function collectionToComponentName(collectionName) {
  return collectionName
    .replace(/^block_/, '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/** * Convert collection name to TypeScript interface name
 * e.g., 'block_hero' -> 'BlockHero'
 */
function getInterfaceName(collectionName) {
  return collectionName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/** * Convert collection name to file name
 * e.g., 'block_hero' -> 'Hero'
 */
function collectionToFileName(collectionName) {
  return collectionToComponentName(collectionName)
}

/**
 * Generate TypeScript interface for component props using proper types
 */
function generatePropsInterface(collectionName, interfaces) {
  const interfaceName = getInterfaceName(collectionName)
  
  // Check if we have a proper interface available
  if (interfaces[interfaceName]) {
    return `${interfaceName} & {
    /** Component ID for Directus visual editing */
    id: string
  }`
  }
  
  // Fallback to basic interface if types aren't available
  return `{
    /** Component ID for Directus visual editing */
    id: string
    /** Additional props based on collection fields */
    [key: string]: any
  }`
}

/**
 * Generate field selectors for getBlockFields
 */
function generateFieldSelectors(fields) {
  const selectors = ['id']
  
  Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
    if (fieldName === 'id') return // Already included
    
    // Handle relations
    if (fieldConfig.relation_type === 'file') {
      selectors.push(`${fieldName}.*`)
    } else if (fieldConfig.relation_type === 'o2m' || fieldConfig.relation_type === 'm2a') {
      selectors.push(`${fieldName}.*`)
    } else if (fieldConfig.type === 'alias') {
      selectors.push(`${fieldName}.*`)
    } else {
      selectors.push(fieldName)
    }
  })
  
  return selectors
}

/**
 * Detect if a field contains block component arrays
 */
function isBlockComponentArray(fieldType) {
  return fieldType && (fieldType.includes('Block') && fieldType.includes('[]'))
}

/**
 * Extract the block component type from an array field
 */
function getBlockComponentFromArray(fieldType) {
  const match = fieldType.match(/Block\w+/)
  return match ? match[0] : null
}

/**
 * Convert TypeScript field type to JavaScript prop definition
 */
function tsTypeToJsProp(fieldType) {
  if (fieldType.includes('string')) {
    return '{ type: String, default: null }'
  } else if (fieldType.includes('number')) {
    return '{ type: Number, default: null }'
  } else if (fieldType.includes('boolean')) {
    return '{ type: Boolean, default: false }'
  } else if (fieldType.includes('[]')) {
    return '{ type: Array, default: () => [] }'
  } else if (fieldType.includes('Block') || fieldType.includes('DirectusFile') || fieldType.includes('Page')) {
    return '{ type: [Object, String], default: null }'
  } else {
    return '{ type: [Object, String], default: null }'
  }
}

/**
 * Generate JavaScript props definition
 */
function generateJsPropsDefinition(collectionName, interfaces) {
  const interfaceName = getInterfaceName(collectionName)
  const interfaceData = interfaces[interfaceName]
  
  if (!interfaceData || !interfaceData.fields) {
    return `defineProps({
  id: { type: String, required: true }
})`
  }
  
  const props = ['  id: { type: String, required: true }']
  
  for (const [fieldName, fieldType] of Object.entries(interfaceData.fields)) {
    if (fieldName !== 'id') {
      props.push(`  ${fieldName}: ${tsTypeToJsProp(fieldType)}`)
    }
  }
  
  return `defineProps({
${props.join(',\n')}
})`
}

/**
 * Generate v-for template for block component arrays
 */
function generateBlockArrayTemplate(fieldName, blockType) {
  const componentName = blockType.replace(/^Block/, '')
  return `      <Blocks${componentName}
        v-for="item in ${fieldName}"
        :key="typeof item === 'string' ? item : item.id"
        v-bind="typeof item === 'string' ? {id: item} : item"
        :id="typeof item === 'string' ? item : item.id"
      />`
}

/**
 * Generate a Vue component template with proper TypeScript types
 */
function generateComponent(collectionName, fields, componentName, interfaces, useTypeScript = true) {
  const interfaceName = getInterfaceName(collectionName)
  const hasProperInterface = interfaces[interfaceName]
  
  const fieldNames = Object.keys(fields).filter(name => 
    name !== 'id' && 
    !name.startsWith('date_') && 
    !name.startsWith('user_') &&
    name !== 'sort'
  )
  
  // Separate regular fields from block component arrays
  const regularFields = []
  const blockArrayFields = []
  
  fieldNames.forEach(name => {
    const fieldType = fields[name]
    if (isBlockComponentArray(fieldType)) {
      const blockType = getBlockComponentFromArray(fieldType)
      if (blockType) {
        blockArrayFields.push({ name, blockType })
      }
    } else {
      regularFields.push(name)
    }
  })
  
  const displayFields = regularFields.slice(0, 3) // Show first 3 non-system, non-block-array fields
  
  // Generate props definition based on language choice
  const propsDefinition = useTypeScript 
    ? generatePropsInterface(collectionName, interfaces)
    : generateJsPropsDefinition(collectionName, interfaces)
  
  const scriptLang = useTypeScript ? ' lang="ts"' : ''
  const importTypes = useTypeScript && hasProperInterface ? `import type { ${interfaceName} } from '@/types/directus'\n` : ''
  
  const propsCode = useTypeScript 
    ? `defineProps<${propsDefinition}>()`
    : propsDefinition
  
  return `<script setup${scriptLang}>
import { setAttr } from '@directus/visual-editing'
${importTypes}
/**
 * ${componentName} block component
 * 
 * @description Auto-generated component for ${collectionName} collection
 * @todo Customize this component template according to your design requirements
 */
${propsCode}
</script>

<template>
  <section
    class="${collectionName.replace(/_/g, '-')}"
    :data-directus="setAttr({ 
      collection: '${collectionName}', 
      item: id, 
      fields: '${fieldNames.join(', ')}', 
      mode: 'drawer' 
    })"
  >
    <div class="${collectionName.replace(/_/g, '-')}__content">
      <!-- TODO: Customize this template based on your design requirements -->
      ${displayFields.length > 0 ? displayFields.map(field => {
        if (field === 'headline' || field === 'title') {
          return `<h2 v-if="${field}" class="headline">{{ ${field} }}</h2>`
        } else if (field === 'tagline') {
          return `<p v-if="${field}" class="tagline">{{ ${field} }}</p>`
        } else if (field === 'description' || field === 'content') {
          return `<div v-if="${field}" class="content" v-html="${field}"></div>`
        } else if (field === 'image' && field.includes('image')) {
          return `<nuxt-img v-if="${field}" :src="\`/api/_directus/assets/\${${field}.id}\`" :alt="${field}.title || ''" class="image" />`
        } else {
          return `<!-- TODO: Add template for ${field} field -->
      <div v-if="${field}" class="${field.replace(/_/g, '-')}">{{ ${field} }}</div>`
        }
      }).join('\n      ') : '<!-- TODO: Add your content here -->'}
      
      ${blockArrayFields.length > 0 ? blockArrayFields.map(({ name, blockType }) => 
        `<!-- Block component array: ${name} -->
      <div v-if="${name} && ${name}.length > 0" class="${name.replace(/_/g, '-')}-container">
${generateBlockArrayTemplate(name, blockType)}
      </div>`
      ).join('\n      ') : ''}
      
      <!-- Add your custom HTML structure here -->
    </div>
  </section>
</template>

<style lang="scss" scoped>
.${collectionName.replace(/_/g, '-')} {
}
</style>
`
}

/**
 * Create a new Vue component file
 */
async function createComponent(collectionName, fields, interfaces) {
  const componentName = collectionToComponentName(collectionName)
  const fileName = `${collectionToFileName(collectionName)}.vue`
  const filePath = path.join(COMPONENTS_DIR, fileName)
  
  // Check if file already exists to prevent overwriting
  try {
    await fs.access(filePath)
    console.log(`⚠️  Component ${fileName} already exists, skipping...`)
    return null
  } catch (error) {
    // File doesn't exist, we can create it
  }
  
  const componentCode = generateComponent(collectionName, fields, componentName, interfaces, !USE_JAVASCRIPT)
  
  try {
    await fs.writeFile(filePath, componentCode, 'utf8')
    console.log(`✅ Created component: ${fileName}`)
    return { collectionName, componentName, fileName, fields }
  } catch (error) {
    console.error(`❌ Failed to create ${fileName}:`, error.message)
    return null
  }
}

/**
 * Update the useBlockComponents composable safely
 */
async function updateComposable(newComponents) {
  if (newComponents.length === 0) {
    console.log('📄 No composable updates needed - no new components were created')
    return
  }
  
  try {
    const content = await fs.readFile(COMPOSABLE_FILE, 'utf8')
    let updatedContent = content
    
    // Extract existing imports from the #components import
    const importMatch = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]#components['"]/s)
    const existingImports = importMatch ? 
      importMatch[1]
        .split(',')
        .map(imp => imp.trim())
        .filter(imp => imp && !imp.includes('\n')) : []
    
    // Add new imports
    const newImports = newComponents.map(comp => `Blocks${comp.componentName}`)
    const allImports = [...new Set([...existingImports, ...newImports])]
    
    // Create properly formatted import statement
    const formattedImports = allImports.map(imp => `  ${imp}`).join(',\n')
    const newImportStatement = `import { \n${formattedImports}\n} from '#components'`
    
    // Update imports
    updatedContent = updatedContent.replace(
      /import\s*{\s*[^}]+\s*}\s*from\s*['"]#components['"]/s,
      newImportStatement
    )
    
    // Add new case statements before the default case
    newComponents.forEach(comp => {
      const caseStatement = `      case '${comp.collectionName}':\n        return Blocks${comp.componentName}`
      
      // Only add if it doesn't already exist
      if (!updatedContent.includes(`case '${comp.collectionName}':`)) {
        // Find the default case and insert before it with proper newline
        const defaultCaseMatch = updatedContent.match(/(      default:\s*\n\s+return 'div')/)
        
        if (defaultCaseMatch) {
          const beforeDefault = updatedContent.substring(0, defaultCaseMatch.index)
          const defaultCase = updatedContent.substring(defaultCaseMatch.index)
          updatedContent = beforeDefault + caseStatement + '\n' + defaultCase
        }
      }
    })
    
    // Add new field mappings to getBlockFields
    newComponents.forEach(comp => {
      const fieldSelectors = generateFieldSelectors(comp.fields)
      const fieldsEntry = `      '${comp.collectionName}': [${fieldSelectors.map(f => `'${f}'`).join(', ')}]`
      
      // Only add if it doesn't already exist
      if (!updatedContent.includes(`'${comp.collectionName}':`)) {
        // Find the closing of the return object and insert before it
        const getBlockFieldsMatch = updatedContent.match(/(return\s*{\s*(?:[^}]+\n)*[^}]+)(\n\s*}\s*})/s)
        
        if (getBlockFieldsMatch) {
          const beforeClosing = updatedContent.substring(0, getBlockFieldsMatch.index + getBlockFieldsMatch[1].length)
          const afterClosing = updatedContent.substring(getBlockFieldsMatch.index + getBlockFieldsMatch[1].length)
          
          // Add comma to the last line if it doesn't have one
          let updatedBeforeClosing = beforeClosing
          if (!beforeClosing.trim().endsWith(',') && !beforeClosing.trim().endsWith('{')) {
            updatedBeforeClosing = beforeClosing + ','
          }
          
          updatedContent = updatedBeforeClosing + '\n' + fieldsEntry + afterClosing
        }
      }
    })
    
    await fs.writeFile(COMPOSABLE_FILE, updatedContent, 'utf8')
    console.log('✅ Updated useBlockComponents.ts composable')
  } catch (error) {
    console.error('❌ Failed to update composable:', error.message)
    console.error('💡 You may need to manually add the new components to useBlockComponents.ts')
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting block component scaffolding...\n')
  console.log(`📝 Language: ${USE_JAVASCRIPT ? 'JavaScript' : 'TypeScript'}`)
  
  // Read TypeScript interfaces
  console.log('📖 Reading TypeScript interfaces...')
  const interfaces = await readTypescriptInterfaces()
  const interfaceCount = Object.keys(interfaces).length
  if (interfaceCount > 0) {
    console.log(`✅ Found ${interfaceCount} TypeScript interfaces`)
  }
  
  // Extract block collections from interfaces
  const blockCollections = getBlockCollectionsFromInterfaces(interfaces)
  console.log(`📦 Found ${blockCollections.length} block collections`)
  
  // Get existing components
  const existingComponents = await getExistingComponents()
  console.log(`📂 Found ${existingComponents.length} existing components: ${existingComponents.join(', ')}`)
  
  // Show actual file names for clarity
  const existingFiles = await fs.readdir(COMPONENTS_DIR).then(files => 
    files.filter(file => file.endsWith('.vue')).map(file => file.replace('.vue', ''))
  ).catch(() => [])
  console.log(`📄 Existing component files: ${existingFiles.join(', ')}`)
  
  // Determine which components need to be created
  const componentsToCreate = blockCollections.filter(collection => {
    const componentName = collectionToComponentName(collection.collection)
    // Case-insensitive comparison to avoid duplicates like RichText vs Richtext
    return !existingComponents.includes(componentName.toLowerCase())
  })
  
  console.log(`\n🔨 Need to create ${componentsToCreate.length} new components:`)
  componentsToCreate.forEach(collection => {
    console.log(`   - ${collection.collection} -> ${collectionToComponentName(collection.collection)}.vue`)
  })
  
  if (componentsToCreate.length === 0) {
    console.log('\n✨ All block components already exist! Nothing to do.')
    return
  }
  
  console.log('\n📝 Creating components...')
  
  // Create components
  const createdComponents = []
  for (const collection of componentsToCreate) {
    const fields = collection.fields || {}
    const result = await createComponent(collection.collection, fields, interfaces)
    if (result) {
      createdComponents.push(result)
    }
  }
  
  // Update composable
  console.log('\n🔄 Updating composable...')
  await updateComposable(createdComponents)
  
  console.log(`\n✨ Successfully scaffolded ${createdComponents.length} new block components!`)
  console.log('\n📝 Next steps:')
  console.log('   1. Review the generated components in the blocks directory')
  console.log('   2. Customize the templates according to your design requirements')
  console.log('   3. Update the TypeScript interfaces if needed')
  console.log('   4. Test the components in your Directus pages')
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  console.error('❌ Unexpected error:', error.message)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled promise rejection:', reason)
  process.exit(1)
})

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error.message)
  process.exit(1)
})