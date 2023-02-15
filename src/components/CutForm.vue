<script setup lang="ts">
    import Card from "./Card.vue";

    defineProps<{
        thumbnailFrom: string;
        thumbnailTo: string;
        duration: number;
    }>();
</script>

<template>
    <Card class="mx-auto max-w-4xl" title="Cut Video">
        <div class="flex items-center">
            <div class="basis-1/2 mr-2">
                <img :src="thumbnailFrom" alt="Start time thumbnail image" />
            </div>
            <div class="basis-1/2">
                <img :src="thumbnailTo" alt="End time thumbnail image" />
            </div>
        </div>

        <div></div>
    </Card>
</template>
