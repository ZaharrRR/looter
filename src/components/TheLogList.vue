<template>
  <div v-if="gameStore.log.length" class="logs">
    <h2>Logs</h2>

    <ul class="logs-ul">
      <li v-for="log in gameStore.log" :key="log">{{ log }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
</script>

<style scoped>
.logs-ul {
  display: flex;
  flex-direction: column;

  max-height: 200px;
  overflow-y: auto;

  color: rgb(160, 160, 160);
}

.logs-ul li {
  padding-right: 20px;
}
</style>
