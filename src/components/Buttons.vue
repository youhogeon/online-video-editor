<script setup lang="ts">
    const emit = defineEmits<{
        (event: "prevStep"): void;
        (event: "nextStep"): void;
    }>();

    const prevStep = () => {
        if (!confirm("Are you sure you want to go back?")) return;

        emit("prevStep");
    };

    const nextStep = () => {
        emit("nextStep");
    };
</script>

<template>
    <div class="flex justify-between">
        <button class="w-20 h-12 pb-1 pr-1 rounded-full text-xl bg-slate-100 mr-2" @click="prevStep">◀</button>
        <button class="w-20 h-12 pb-1 pl-1 rounded-full text-xl bg-slate-100" @click="nextStep">▶</button>
    </div>
</template>