import { defineStore } from 'pinia'

interface Item {
  name: string
  quantity: number
  value: number
}

interface Chest {
  opened: boolean
  loot: Item
}

interface Location {
  id: string
  name: string
  chests: Chest[]
}

interface Player {
  inventory: Item[]
  gold: number
}

interface Upgrade {
  name: string
  price: {
    gold: number
    resources: Item[]
  }
  effect: string
}

const itemTypes = [
  { name: 'Gold', value: 1, minQuantity: 1, maxQuantity: 20 },
  { name: 'Diamond', value: 20, minQuantity: 1, maxQuantity: 2 },
  { name: 'Sword', value: 26, minQuantity: 1, maxQuantity: 2 },
  { name: 'Stick', value: 1, minQuantity: 1, maxQuantity: 5 },
  { name: 'Axe', value: 10, minQuantity: 1, maxQuantity: 1 },
  { name: 'Shield', value: 8, minQuantity: 1, maxQuantity: 1 },
  { name: 'Potion', value: 5, minQuantity: 1, maxQuantity: 3 },
  { name: 'Gem', value: 15, minQuantity: 1, maxQuantity: 3 },
  { name: 'Bone', value: 2, minQuantity: 1, maxQuantity: 1 }
]

const locationTypes = [
  { name: 'Cave' },
  { name: 'Dungeon' },
  { name: 'Castle' },
  { name: 'Forest' },
  { name: 'Mountain' },
  { name: 'Beach' },
  { name: 'Island' },
  { name: 'Ruins' },
  { name: 'Temple' },
  { name: 'Volcano' }
]

function generateLoot() {
  const randomIndex = Math.floor(Math.random() * itemTypes.length)
  const itemType = itemTypes[randomIndex]
  const quantity =
    Math.floor(Math.random() * (itemType.maxQuantity - itemType.minQuantity + 1)) +
    itemType.minQuantity
  return {
    name: itemType.name,
    quantity: quantity,
    value: itemType.value
  }
}

function generateChests(numberOfChests: number): Chest[] {
  const chests: Chest[] = []
  for (let i = 0; i < numberOfChests; i++) {
    chests.push({
      opened: false,
      loot: generateLoot()
    })
  }
  return chests
}

function generateLocations(numberOfLocations: number): Location[] {
  const locations: Location[] = []
  for (let i = 0; i < numberOfLocations; i++) {
    const randomNameIndex = Math.floor(Math.random() * locationTypes.length)
    const randomNumberOfChests = Math.floor(Math.random() * 5) + 1
    locations.push({
      id: (i + 1).toString(),
      name: locationTypes[randomNameIndex].name,
      chests: generateChests(randomNumberOfChests)
    })
  }
  return locations
}

export const useGameStore = defineStore('game', {
  state: () => ({
    locations: generateLocations(3),
    player: {
      inventory: [
        {
          name: 'Stick',
          quantity: 1,
          value: 1
        }
      ],

      gold: 10
    } as Player,
    currentLocation: null as Location | null,
    lastLocationGenerationTime: null as Date | null,
    remainingTimeForGeneration: 0,
    log: [] as string[]
  }),
  actions: {
    //locations

    setCurrentLocation(locationId: string) {
      this.currentLocation = this.locations.find((loc) => loc.id === locationId) || null
    },

    nextLocation() {
      if (this.currentLocation) {
        const currentIndex = this.locations.findIndex((loc) => loc.id === this.currentLocation?.id)
        if (currentIndex < this.locations.length - 1) {
          this.setCurrentLocation(this.locations[currentIndex + 1].id)
        }
      }
    },

    generateNewLocations() {
      if (this.lastLocationGenerationTime) {
        const now = new Date()
        const timeDifference = now.getTime() - this.lastLocationGenerationTime.getTime()
        if (timeDifference < 60000) {
          alert('You cant find new locations yet :<')
          return
        }
      }

      this.locations = generateLocations(Math.floor(Math.random() * 5) + 1)
      this.lastLocationGenerationTime = new Date()
      this.remainingTimeForGeneration = 60000

      this.locations.forEach((localtion) => {
        this.log.unshift(
          `Found new location: ${localtion.name} whit ${localtion.chests.length} chests!`
        )
      })
    },

    updateRemainingTime() {
      if (this.lastLocationGenerationTime) {
        const now = new Date()
        const timeDifference = now.getTime() - this.lastLocationGenerationTime.getTime()
        if (timeDifference < 60000) {
          this.remainingTimeForGeneration = 60000 - timeDifference
        } else {
          this.remainingTimeForGeneration = 0
        }
      }
    },

    // loot and inventory

    openChest(index: number) {
      if (this.currentLocation && !this.currentLocation.chests[index].opened) {
        this.currentLocation.chests[index].opened = true
        const loot = this.currentLocation.chests[index].loot

        if (loot.name === 'Gold') {
          this.player.gold += loot.quantity
        } else {
          this.addItem(loot)
        }

        this.log.unshift(`${this.currentLocation.name}: you found  ${loot.name} (${loot.quantity})`)
      }
    },

    addItem(item: Item) {
      const existingItem = this.player.inventory.find((i) => i.name === item.name)
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        this.player.inventory.push({ ...item })
      }
    },

    sellItem(itemName: string, quantity: number) {
      const item = this.player.inventory.find((i) => i.name === itemName)
      if (item && item.quantity >= quantity) {
        item.quantity -= quantity
        this.player.gold += item.value * quantity
        if (item.quantity === 0) {
          this.player.inventory = this.player.inventory.filter((i) => i.name !== itemName)
        }
        this.log.unshift(`You sold ${quantity} ${itemName} for ${item.value * quantity} gold`)
      }
    },

    // game

    resetGame() {
      this.locations.forEach((loc) => loc.chests.forEach((chest) => (chest.opened = false)))
      this.player.inventory = [{ name: 'Stick', quantity: 1, value: 1 }]
      this.player.gold = 10
      this.currentLocation = null
    },

    saveGame() {
      localStorage.setItem(
        'gameState',
        JSON.stringify({
          locations: this.locations,
          player: this.player,
          currentLocation: this.currentLocation
        })
      )
    },

    loadGame() {
      const savedState = localStorage.getItem('gameState')
      if (savedState) {
        const state = JSON.parse(savedState)
        this.locations = state.locations
        this.player = state.player
        this.currentLocation = state.currentLocation
      }
    }
  }
})
