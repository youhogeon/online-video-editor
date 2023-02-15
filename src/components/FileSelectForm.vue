<script setup lang="ts">
    import { ref, defineEmits } from "vue";

    const emit = defineEmits<{
        (event: "selected", files: File): void;
    }>();

    const fileInput = ref<HTMLInputElement>();
    const onDrag = ref<Boolean>(false);

    const onClick = () => {
        fileInput.value?.click();
    };

    const onDragenter = (event: DragEvent) => {
        onDrag.value = true;
    };

    const onDragleave = (event: DragEvent) => {
        onDrag.value = false;
    };

    const onDragover = (event: DragEvent) => {
        event.preventDefault();
    };

    const onDrop = (event: DragEvent) => {
        onDragleave(event);
        event.preventDefault();
        afterSelected(event.dataTransfer?.files as FileList | null);
    };

    const onFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        afterSelected(target.files);
    };

    const afterSelected = (files: FileList | null) => {
        if (!files || !files.length) return;

        if (files[0].size > 1024 * 1024 * 1024 * 2) {
            alert("The file must be less than 2 GB.");
            return;
        }

        emit("selected", files[0]);
    };
</script>

<template>
    <div
        class="border-dashed border-slate-50 border px-8 py-40 text-center cursor-pointer text-3xl bg-slate-800 rounded"
        :class="{ 'bg-slate-500': onDrag }"
        @dragenter="onDragenter"
        @dragover="onDragover"
        @dragleave="onDragleave"
        @drop="onDrop"
        @click="onClick"
    >
        <input type="file" ref="fileInput" class="hidden" @change="onFileChange" />

        Drag Video File Here<br />

        <div class="text-sm mt-4">
            Your file will not be transferred outside of your device.
        </div>
    </div>
</template>
