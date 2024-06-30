<template>
  <div>
    <button @click="open" :disabled="chest.opened" class="btn">
      {{ chest.opened ? 'Opened' : 'Open Chest' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  chest: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['open'])

const open = () => {
  emits('open')
}
</script>
