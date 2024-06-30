<template>
  <div class="locations">
    <h2>Location</h2>

    <select v-model="selectedLocation" @change="setLocation">
      <option value="">-- select location --</option>
      <option v-for="location in gameStore.locations" :key="location.id" :value="location.id">
        {{ location.name }}
      </option>
    </select>

    <div class="locations-find">
      <span>find new locations</span>

      <button
        @click="findLocations"
        :disabled="gameStore.remainingTimeForGeneration != 0"
        class="btn"
      >
        Find
      </button>
      <span v-if="gameStore.remainingTimeForGeneration"
        >{{ Math.floor(gameStore.remainingTimeForGeneration / 1000) }}c</span
      >
    </div>

    <div v-if="gameStore.currentLocation" class="locations-chests">
      <p>
        current location: <strong>{{ gameStore.currentLocation.name }}</strong>
      </p>

      <div v-if="gameStore.currentLocation.chests" class="chests">
        <p>chests</p>
        <div v-for="(chest, index) in gameStore.currentLocation.chests" :key="index">
          <Chest :chest="chest" @open="openChest(index)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { useGameStore } from '@/stores/gameStore'

import Chest from '@/components/ChestBlock.vue'

const gameStore = useGameStore()

const selectedLocation = ref('')

const setLocation = () => {
  gameStore.setCurrentLocation(selectedLocation.value)
}

const openChest = (index: number) => {
  gameStore.openChest(index)
}

const findLocations = () => {
  gameStore.generateNewLocations()
  selectedLocation.value = ''
}

setInterval(() => {
  gameStore.updateRemainingTime()
}, 1000)
</script>

<style scoped>
.locations {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 300px;
}

.locations-find {
  display: flex;
  align-items: center;
  gap: 12px;
}

.locations-chests {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chests {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
