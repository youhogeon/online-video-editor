<script setup lang="ts">
    import { computed, ref } from "vue";

    import Card from "./Card.vue";
    import Buttons from "./Buttons.vue";
    import TimeForm from "./TimeForm.vue";

    const props = defineProps<{
        thumbnailFrom: string;
        thumbnailTo: string;
        duration: number;
    }>();

    const emit = defineEmits<{
        (event: "changeStartTime", time: number): void;
        (event: "changeEndTime", time: number): void;
        (event: "nextStep", startTime: number, endTime: number): void;
    }>();

    const startTime = ref<number>(0);
    const endTime = ref<number>(props.duration);

    const inputStartTime = () => {
        if (startTime.value >= endTime.value) {
            startTime.value = endTime.value - 1;
        }

        emit("changeStartTime", startTime.value);
    };

    const inputEndTime = () => {
        if (startTime.value >= endTime.value) {
            endTime.value = startTime.value + 1;
        }

        if (endTime.value > props.duration) {
            endTime.value = props.duration;
        }

        emit("changeEndTime", endTime.value);
    };

    const prevStep = () => {
        location.reload();
    };

    const nextStep = () => {
        emit("nextStep", startTime.value, endTime.value);
    };

    const boxLeft = ref<number>(0);
    const boxLeftPx = computed(() => {
        return boxLeft.value + 'px';
    })

    const boxWidth = ref<number>(300);
    const boxWidthPx = computed(() => {
        return boxWidth.value + 'px';
    })

    let moveType = 0;
    let initOffset = 0;
    let initWidth = 0;
    let initLeft = 0;
    const moveStart = (event: MouseEvent) => {
        console.log(event)
        moveType = parseInt((event.target as HTMLElement)?.getAttribute("data-value")??"0");

        initLeft = boxLeft.value;
        initWidth = boxWidth.value;
        initOffset = event.clientX;
        console.log(initOffset)
    }

    const moving = (event: MouseEvent) => {
        if (moveType <= 0) return;
        //console.log(event.offsetX)

        if (moveType === 1) {
            boxWidth.value = initOffset - event.clientX + initWidth;
            console.log(boxWidth.value)
            if (boxWidth.value >= 16)
            boxLeft.value = initLeft - boxWidth.value + initWidth;
        } else if (moveType === 2) {
            const left = event.clientX - initOffset + initLeft;
            if (left < 0) {
                console.log("fuck", event.clientX, initOffset , initLeft)
                return;
            }

            boxLeft.value = left;
        } else if (moveType === 3) {
            boxWidth.value = event.clientX - initOffset + initWidth;
        }

    }

    const moveEnd = (event: MouseEvent) => {
        moveType = 0;
    }
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

        <div class="flex mt-2">
            <TimeForm class="basis-1/2 mr-2" v-model="startTime" @change="inputStartTime" />
            <TimeForm class="basis-1/2" v-model="endTime" @change="inputEndTime" />
        </div>

        <div class="mt-4 bg-slate-300 h-14 relative select-none" @mousedown="moveStart" @mousemove="moving" @mouseup="moveEnd">
            <div class="flex justify-between absolute w-full" :style="{ left: boxLeftPx, width:boxWidthPx }">
                <div class="shrink-0 bg-slate-900 w-2 h-14 cursor-ew-resize" data-value="1"></div>
                <div class="basis-full bg-gradient-to-r from-indigo-300 to-teal-300 cursor-pointer" data-value="2">range bar</div>
                <div class="shrink-0 bg-slate-800 w-2 h-14 cursor-ew-resize" data-value="3"></div>
            </div>
        </div>

        <Buttons class="mt-4" @prevStep="prevStep" @nextStep="nextStep" />
    </Card>
</template>
