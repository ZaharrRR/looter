import { defineStore } from 'pinia'

import type { Upgrade } from '@/types'

interface State {
  chestRate: number
  lootRate: number
  locationRate: number
}

type StateKey = keyof State

export const useStateStore = defineStore('stateStore', {
  state: (): State => ({
    chestRate: 3,
    lootRate: 3,
    locationRate: 3
  }),

  actions: {
    increaseState(upgrade: Upgrade & { name: StateKey }) {
      if (this[upgrade.name] !== undefined) {
        this[upgrade.name] += upgrade.value
      }
    }
  }
})
