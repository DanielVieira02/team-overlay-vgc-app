import pokemonTranslator from '../assets/TranslatorPokes.json'
import itemTranslator from '../assets/TranslatorItems.json'

export function getPokemonIconPath(pokemonName: string): string {
  if (!pokemonName) return '/assets/PokeIcons/025_000.png'
  
  // Clean the pokemon name to match the translator
  const cleanName = pokemonName
    .replace(/[^a-zA-Z0-9-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '') // Remove spaces
  
  // Try different variations of the name
  const variations = [
    pokemonName,
    cleanName,
    pokemonName.replace('-', ''),
    pokemonName.replace(/[\s-]/g, ''), // Remove spaces and hyphens
    pokemonName.split(' ')[0], // First word only
    pokemonName.split('(')[0].trim(), // Remove parentheses content
    pokemonName.split('-')[0], // First part before hyphen
  ]
  
  for (const variation of variations) {
    if (pokemonTranslator[variation as keyof typeof pokemonTranslator]) {
      const spriteId = pokemonTranslator[variation as keyof typeof pokemonTranslator]
      return `/assets/PokeIcons/${spriteId}.png`
    }
  }
  
  // Try case variations
  for (const variation of variations) {
    const lowerCase = variation.toLowerCase()
    const upperCase = variation.toUpperCase()
    const titleCase = variation.charAt(0).toUpperCase() + variation.slice(1).toLowerCase()
    
    for (const caseVariation of [lowerCase, upperCase, titleCase]) {
      if (pokemonTranslator[caseVariation as keyof typeof pokemonTranslator]) {
        const spriteId = pokemonTranslator[caseVariation as keyof typeof pokemonTranslator]
        return `/assets/PokeIcons/${spriteId}.png`
      }
    }
  }
  
  // Log missing Pokemon for debugging
  console.warn(`Pokemon icon not found for: "${pokemonName}". Tried variations:`, variations)
  
  // Fallback to a default Pokemon icon
  return '/assets/PokeIcons/025_000.png' // Pikachu as fallback
}

export function getItemIconPath(itemName?: string): string {
  if (!itemName) return '/assets/ItemsIcons/0.png'
  
  // Clean the item name
  const cleanName = itemName
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .trim()
  
  // Try different variations of the name
  const variations = [
    itemName,
    cleanName,
    itemName.replace('-', ' '),
    itemName.replace(' ', ''),
    itemName.replace(/\s+/g, ' '), // Normalize spaces
  ]
  
  for (const variation of variations) {
    if (itemTranslator[variation as keyof typeof itemTranslator]) {
      const itemId = itemTranslator[variation as keyof typeof itemTranslator]
      return `/assets/ItemsIcons/${itemId}.png`
    }
  }
  
  // Try case variations
  for (const variation of variations) {
    const titleCase = variation.replace(/\b\w/g, l => l.toUpperCase())
    const lowerCase = variation.toLowerCase()
    
    for (const caseVariation of [titleCase, lowerCase]) {
      if (itemTranslator[caseVariation as keyof typeof itemTranslator]) {
        const itemId = itemTranslator[caseVariation as keyof typeof itemTranslator]
        return `/assets/ItemsIcons/${itemId}.png`
      }
    }
  }
  
  // Log missing items for debugging
  console.warn(`Item icon not found for: "${itemName}". Tried variations:`, variations)
  
  // Fallback to a default item icon (no item)
  return '/assets/ItemsIcons/0.png'
}

export function getTypeIconPath(typeName: string): string {
  // Type icons are typically lowercase
  const cleanType = typeName.toLowerCase()
  return `/assets/TypeIcons/${cleanType}.png`
}