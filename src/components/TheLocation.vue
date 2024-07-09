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
          <ChestBlock :chest="chest" @open="openChest(index)" />
        </div>
      </div>
    </div>

    <ModalWindow :is-opened="isOpenedChestModal" @close="CloseChestModal">
      <template #title> Chest modal </template>
      <div v-for="item in selectedChest?.loot" :key="item.name">
        <p>{{ item.name }} - {{ item.quantity }} (Value: {{ item.value }})</p>
        <button @click="takeItem(item)" class="btn">take</button>
      </div>
    </ModalWindow>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import ModalWindow from '@/components/UI/ModalWindow.vue'

import { useGameStore } from '@/stores/gameStore'

import ChestBlock from '@/components/ChestBlock.vue'
import type { Chest, Item } from '@/types'

const gameStore = useGameStore()

const selectedLocation = ref('')
const selectedChest = ref<Chest>()

const isOpenedChestModal = ref(false)

const setLocation = () => {
  gameStore.setCurrentLocation(selectedLocation.value)
}

const openChest = (index: number) => {
  selectedChest.value = gameStore.currentLocation?.chests[index]

  isOpenedChestModal.value = true
}

const takeItem = (item: Item) => {
  gameStore.addItem(item)

  selectedChest.value?.loot.splice(selectedChest.value?.loot.indexOf(item), 1)
}

const findLocations = () => {
  gameStore.generateNewLocations()
  selectedLocation.value = ''
}

setInterval(() => {
  gameStore.updateRemainingTime()
}, 1000)

const CloseChestModal = () => {
  isOpenedChestModal.value = false
  if (selectedChest.value) selectedChest.value.opened = true
}
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
