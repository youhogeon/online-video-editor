<script setup lang="ts">
    defineProps<{
        text: string;
    }>();
</script>

<template>
    <h1 class="text-6xl text-zinc-50 font-logo text-center">
        {{ text }}
    </h1>
</template>