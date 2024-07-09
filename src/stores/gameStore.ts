import { defineStore } from 'pinia'

import type { Location, Player, Item } from '@/types'
import { generateLocations, generateChests } from '@/utils/generators'

export const useGameStore = defineStore('game', {
  state: () => ({
    locations: generateLocations(3, 3, 3),
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
    log: [] as string[],
    upgrades: {
      remainingTimeForGenerationSpeed: 0,
      additionalСhests: 0
    }
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
        if (timeDifference < 60000 - this.upgrades.remainingTimeForGenerationSpeed) {
          alert('You cant find new locations yet :<')
          return
        }
      }

      this.locations = generateLocations(
        Math.floor(Math.random() * 3) + 1,
        Math.floor(Math.random() * 3) + 1,
        Math.floor(Math.random() * 3) + 1
      )
      this.lastLocationGenerationTime = new Date()
      this.remainingTimeForGeneration = 60000 - this.upgrades.remainingTimeForGenerationSpeed

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
        if (timeDifference < 60000 - this.upgrades.remainingTimeForGenerationSpeed) {
          this.remainingTimeForGeneration =
            60000 - this.upgrades.remainingTimeForGenerationSpeed - timeDifference
        } else {
          this.remainingTimeForGeneration = 0
        }
      }
    },

    // loot and inventory

    // openChest(index: number) {
    //   if (this.currentLocation && !this.currentLocation.chests[index].opened) {
    //     this.currentLocation.chests[index].opened = true
    //     const loot = this.currentLocation.chests[index].loot

    //     if (loot.name === 'Gold') {
    //       this.player.gold += loot.quantity
    //     } else {
    //       this.addItem(loot)
    //     }

    //     this.log.unshift(`${this.currentLocation.name}: you found  ${loot.name} (${loot.quantity})`)
    //   }
    // },

    addItem(item: Item) {
      if (item.name === 'Gold') {
        this.player.gold += item.quantity
      } else {
        const existingItem = this.player.inventory.find((i) => i.name === item.name)
        if (existingItem) {
          existingItem.quantity += item.quantity
        } else {
          this.player.inventory.push({ ...item })
        }
      }
      this.log.unshift(
        `at location - ${this.currentLocation?.name}: you take  ${item.name} (${item.quantity})`
      )
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
