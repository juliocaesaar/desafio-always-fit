<template>
  <div class="flex items-center justify-center py-8">
    <span class="loader"></span>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.loader {
  display: inline-block;
  width: 48px;
  height: 48px;
  border: 5px solid #e5e7eb;
  border-top: 5px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
