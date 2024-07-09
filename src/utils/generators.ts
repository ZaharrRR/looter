import { itemTypes, locationTypes } from '@/consts/types'

import type { Item, Chest, Location } from '@/types'

export function generateLoot(numberOfItems: number): Item[] {
  const items: Item[] = []
  for (let i = 0; i < numberOfItems; i++) {
    const randomIndex = Math.floor(Math.random() * itemTypes.length)
    const itemType = itemTypes[randomIndex]
    const quantity =
      Math.floor(Math.random() * (itemType.maxQuantity - itemType.minQuantity + 1)) +
      itemType.minQuantity
    items.push({
      name: itemType.name,
      quantity: quantity,
      value: itemType.value
    })
  }
  return items
}

export function generateChests(numberOfChests: number, numberOfItemsPerChest: number): Chest[] {
  const chests: Chest[] = []
  for (let i = 0; i < numberOfChests; i++) {
    chests.push({
      opened: false,
      loot: generateLoot(numberOfItemsPerChest)
    })
  }
  return chests
}

export function generateLocations(
  numberOfLocations: number,
  numberOfChestsPerLocation: number,
  numberOfItemsPerChest: number
): Location[] {
  const locations: Location[] = []
  for (let i = 0; i < numberOfLocations; i++) {
    const randomNameIndex = Math.floor(Math.random() * locationTypes.length)
    locations.push({
      id: (i + 1).toString(),
      name: locationTypes[randomNameIndex].name,
      chests: generateChests(numberOfChestsPerLocation, numberOfItemsPerChest)
    })
  }
  return locations
}
