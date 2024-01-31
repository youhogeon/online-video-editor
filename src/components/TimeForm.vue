<script setup lang="ts">
    import { ref, watch } from 'vue';

    const props = defineProps<{
        modelValue: number;
    }>();

    const emit = defineEmits<{
        (event: "update:modelValue", value: number): void;
    }>();

    const change = () => {
        H.value = Math.floor(H.value);
        M.value = Math.floor(M.value);
        S.value = Math.round(S.value * 100) / 100;

        H.value = Math.max(0, H.value);
        M.value = Math.max(0, Math.min(59, M.value));
        S.value = Math.max(0, Math.min(59.99, S.value));

        emit("update:modelValue", H.value * 360000 + M.value * 6000 + S.value * 100);
    };

    const H = ref<number>(0);
    const M = ref<number>(0);
    const S = ref<number>(0);

    const calcHMS = (newValue: number) => {
        H.value = Math.floor(newValue / 360000);
        M.value = Math.floor(newValue / 6000) % 60;
        S.value = (newValue % 6000) / 100;
    }

    calcHMS(props.modelValue);
    watch(() => props.modelValue, calcHMS);
</script>

<template>
    <div class="flex items-end bg-slate-300 p-2 rounded w-40">
        <div class="basis-1/4">
            <input type="number" class="w-full bg-transparent border-b-2 border-slate-900 text-center text-2xl" v-model.number="H" min="0" @input="change" />
        </div>
        <div class="ml-1 mr-3 font-bold">H</div>
        <div class="basis-1/4">
            <input type="number" class="w-full bg-transparent border-b-2 border-slate-900 text-center text-2xl" step="1" min="0" max="59" v-model.number="M" @input="change" />
        </div>
        <div class="ml-1 mr-3 font-bold">M</div>
        <div class="basis-5/12">
            <input type="number" class="w-full bg-transparent border-b-2 border-slate-900 text-center text-2xl" step="0.01" min="0" max="59.99" v-model.number="S" @input="change" />
        </div>
    </div>
</template>