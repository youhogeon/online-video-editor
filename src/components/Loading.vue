<script setup lang="ts">
    import LoadingIcon from "./LoadingIcon.vue";
</script>

<template>
  <div class="text-center">
    <LoadingIcon class="w-80 mx-auto" />
    <div class="mt-12 text-3xl">
        <slot />
    </div>
  </div>
</template>
