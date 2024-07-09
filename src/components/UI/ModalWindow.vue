<template>
  <div class="wrapper" v-if="isOpened" @click="$emit('close')">
    <div class="wrapper-content" @click.stop>
      <div class="wrapper-top">
        <h2><slot name="title"></slot></h2>
        <button @click="$emit('close')" class="btn-close">X</button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isOpened: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>

<style scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper-content {
  transform: translate(-50%, -50%);

  background-color: white;
  padding: 20px;
  border-radius: 10px;

  color: black;
}

.wrapper-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 16px;
}

.btn-close {
  color: black;
  font-weight: 700;
  font-size: 20px;
}
</style>
