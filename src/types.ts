export interface Item {
  name: string
  quantity: number
  value: number
}

export interface Chest {
  opened: boolean
  loot: Item[]
}

export interface Location {
  id: string
  name: string
  chests: Chest[]
}

export interface Player {
  inventory: Item[]
  gold: number
}

export interface Upgrade {
  name: string
  value: number
  description: string
  cost: number
  resources: Item[]
}
