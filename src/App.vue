<script setup lang="ts">
    import { ref } from "vue";
    import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

    import { getExtension, randomFileName } from "./utils/File";
    import Logo from "./components/Logo.vue";
    import FileSelectForm from "./components/FileSelectForm.vue";
    import CutForm from "./components/CutForm.vue";
    import Loading from "./components/Loading.vue";

    interface videoInfo {
        valid: boolean;
        duration: number;
        width: number;
        height: number;
    }

    const durationRegex = /^(.*)Duration:\s([0-9\.:]+)(.*)$/;
    const resolutionRegex = /^(.+), ([0-9]+x[0-9]+)(.+)$/;

    const ffmpeg = createFFmpeg();
    const videoInfo = ref<videoInfo>({
        valid: false,
        duration: 0,
        width: 0,
        height: 0,
    });

    ffmpeg.setLogger(({ type, message }) => {
        if (
            videoInfo.value.valid === null &&
            message.includes("Invalid data found when processing input")
        )
            videoInfo.value.valid = false;

        if (videoInfo.value.duration === 0 && durationRegex.test(message)) {
            const duration = message.replace(durationRegex, "$2");
            const [hms, ms] = duration.split(".");
            const [hours, minutes, seconds] = hms.split(":");

            videoInfo.value.duration =
                parseInt(hours) * 60 * 60 +
                parseInt(minutes) * 60 +
                parseInt(seconds) * 1 +
                parseInt(ms) / 100;
            videoInfo.value.valid = videoInfo.value.duration > 0.1;
        }

        if (videoInfo.value.width === 0 && resolutionRegex.test(message)) {
            const resolution = message.replace(resolutionRegex, "$2");
            const [width, height] = resolution.split("x");

            videoInfo.value.width = parseInt(width);
            videoInfo.value.height = parseInt(height);
        }

        console.log(message);
    });

    const loading = ref<string | null>();
    const selectedFile = ref<File>();
    const thumbnailFrom = ref<string>();
    const thumbnailTo = ref<string>();
    const cutFrom = ref<number>(0);
    const cutTo = ref<number>(0);
    const inputFileName = "INPUTFILE";

    const getThumbnail = async (startTime: number) => {
        if (videoInfo.value.valid !== true || !ffmpeg.isLoaded()) return;

        const outputFileName = randomFileName("png");

        await ffmpeg.run(
            "-ss",
            String(startTime),
            "-i",
            inputFileName,
            "-vframes",
            "1",
            outputFileName
        );
        const data = ffmpeg.FS("readFile", outputFileName);
        const url = URL.createObjectURL(
            new Blob([data.buffer], { type: "image/png" })
        );

        ffmpeg.FS("unlink", outputFileName);

        return url;
    };

    const selected = async (file: File) => {
        selectedFile.value = file;
        //inputFileName = "input." + getExtension(file.name);

        loading.value = "Reading file...";
        if (!ffmpeg.isLoaded()) await ffmpeg.load();
        ffmpeg.FS("writeFile", inputFileName, await fetchFile(file));

        loading.value = "Checking file...";
        await ffmpeg.run("-i", inputFileName, "-f", "null");

        if (videoInfo.value.valid !== true) {
            alert("Please select a valid video file.");
            location.reload();
            return;
        }

        loading.value = "Making Thumbnail...";
        thumbnailFrom.value = await getThumbnail(0);
        thumbnailTo.value = await getThumbnail(videoInfo.value.duration - 0.1);

        loading.value = null;
    };

    const video = ref<string>("");

    const convert = async () => {
        const file = selectedFile.value;

        await ffmpeg.run("-i", "test.avi", "test.mp4");
        const data = ffmpeg.FS("readFile", "test.mp4");
        video.value = URL.createObjectURL(
            new Blob([data.buffer], { type: "video/mp4" })
        );
    };
</script>

<template>
    <vue-particles color="#dedede"></vue-particles>

    <Logo text="Video Editor" class="mt-8 mb-16" />

    <FileSelectForm
        class="mx-auto max-w-4xl"
        @selected="selected"
        v-if="!selectedFile"
    />
    <Loading class="mx-auto max-w-4xl" v-if="loading">{{ loading }}</Loading>

    <CutForm
        v-if="thumbnailFrom && thumbnailTo"
        :thumbnailFrom="thumbnailFrom"
        :thumbnailTo="thumbnailTo"
        :duration="videoInfo.duration"
    />
</template>
