<template>
  <div class="inventory">
    <h2>Inventory</h2>
    <p>Gold: {{ gameStore.player.gold }}</p>

    <ul class="inventory-list">
      <li v-for="(item, index) in gameStore.player.inventory" :key="index">
        <span>{{ item.name }} - {{ item.quantity }} (Value: {{ item.value }})</span>
        <button @click="sellItem(item.name, 1)" class="btn">Sell 1</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const sellItem = (itemName: string, quantity: number) => {
  gameStore.sellItem(itemName, quantity)
}
</script>

<style scoped>
.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 300px;
}

.inventory-list li {
  display: flex;
  justify-content: space-between;
}
</style>
