<template>
  <div>
    <h2>Upgrades</h2>

    <!-- <ul>
      <li v-for="upgrade in upgrades" :key="upgrade.id">
        <p>{{ upgrade.name }}</p>
        <p>{{ upgrade.cost }}g</p>
        <button @click="gameStore.buyUpgrade(upgrade.id)" class="btn">buy</button>
      </li>
    </ul> -->
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
</script>

<style scoped></style>
