<template>
  <div id="app">
    <header>
      <h1>Treasure Hunter</h1>

      <div class="header-menu">
        <button @click="gameStore.saveGame" class="btn">Save</button>
        <button @click="gameStore.resetGame" class="btn">Reset</button>
      </div>
    </header>

    <main>
      <Location />
      <Inventory />
      <LogList />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

import Location from '@/components/TheLocation.vue'
import Inventory from '@/components/TheInventory.vue'
import LogList from '@/components/TheLogList.vue'

import { useGameStore } from './stores/gameStore'

const gameStore = useGameStore()

// onMounted(() => {
//   gameStore.loadGame()
// })
</script>

<style scoped>
#app {
  width: 1280px;
  margin: 0 auto;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-menu {
  display: flex;
  gap: 12px;
}

main {
  display: flex;
  gap: 48px;
}
</style>
