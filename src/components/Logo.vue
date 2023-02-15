<script setup lang="ts">
    defineProps<{
        text: string;
    }>();
</script>

<template>
    <h1 class="text-6xl font-logo text-center">
        {{ text }}
    </h1>
</template>
