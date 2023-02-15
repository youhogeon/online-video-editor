<script setup lang="ts">
    defineProps<{
        title: string;
    }>();
</script>

<template>
    <div class="rounded-md">
        <div
            class="bg-gradient-to-r from-indigo-600 to-teal-500 rounded-t-md w-full relative"
        >
            <div class="px-3 py-2 flex">
                <div class="w-4 h-4 mr-2 bg-red-500 rounded-full"></div>
                <div class="w-4 h-4 mr-2 bg-yellow-500 rounded-full"></div>
                <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <h2
                class="absolute top-0 w-full text-center text-white text-2xl tracking-wide"
            >
                {{ title }}
            </h2>
        </div>
        <div
            class="px-4 py-6 bg-slate-50 bg-opacity-20 text-slate-900 rounded-b-md"
        >
            <slot />
        </div>
    </div>
</template>
