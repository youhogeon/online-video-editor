<script setup lang="ts">
    import { ref } from 'vue';
    import Logo from './components/Logo.vue';
    import UploadForm from './components/UploadForm.vue';
    import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

    const ffmpeg = createFFmpeg({
        log: true,
    });

    const video = ref<string>("");

    const test = async (file: File) => {
        const name = file.name;

        if (!ffmpeg.isLoaded()) await ffmpeg.load();
        ffmpeg.FS("writeFile", "test.avi", await fetchFile(file));
        await ffmpeg.run("-i", "test.avi", "test.mp4");
        const data = ffmpeg.FS("readFile", "test.mp4");
        video.value = URL.createObjectURL(
            new Blob([data.buffer], { type: "video/mp4" })
        );
    }
</script>

<template>
    <Logo text="Video Editor" class="mt-8 mb-16" />

    <UploadForm class="mx-auto max-w-4xl" @selected="test" />

    <video :src="video" controls />
</template>