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
        progress: number;
    }

    const durationRegex = /^(.*)Duration:\s([0-9\.:]+)(.*)$/;
    const resolutionRegex = /^(.+), ([0-9]+x[0-9]+)(.+)$/;

    const ffmpeg = createFFmpeg();
    const videoInfo = ref<videoInfo>({
        valid: false,
        duration: 0,
        width: 0,
        height: 0,
        progress: 0,
    });

    ffmpeg.setLogger(({ type, message }) => {
        console.log(message);

        if (videoInfo.value.valid === null && message.includes("Invalid data found when processing input")){
            videoInfo.value.valid = false;

            return;
        }

        if (videoInfo.value.duration === 0 && durationRegex.test(message)) {
            const duration = message.replace(durationRegex, "$2");
            const [hours, minutes, seconds] = duration.split(":");

            videoInfo.value.duration =
                parseInt(hours) * 360000 +
                parseInt(minutes) * 6000 +
                parseFloat(seconds) * 100;
            videoInfo.value.valid = videoInfo.value.duration >= 1;

            return;
        }

        if (videoInfo.value.width === 0 && resolutionRegex.test(message)) {
            const resolution = message.replace(resolutionRegex, "$2");
            const [width, height] = resolution.split("x");

            videoInfo.value.width = parseInt(width);
            videoInfo.value.height = parseInt(height);

            return;
        }
    });

    ffmpeg.setProgress(({ ratio }) => {
        videoInfo.value.progress = ratio;
        progressEvent(ratio);
    });

    const loading = ref<string | null>();
    const selectedFile = ref<File>();
    const thumbnailFrom = ref<string>();
    const thumbnailTo = ref<string>();
    const cutStartTime = ref<number>();
    const cutEndTime = ref<number>();
    const inputFileName = "INPUTFILE";

    const getThumbnail = async (time: number) => {
        if (videoInfo.value.valid !== true || !ffmpeg.isLoaded()) return;

        const outputFileName = randomFileName("png");

        await ffmpeg.run(
            "-ss",
            String(time / 100),
            "-i",
            inputFileName,
            "-vframes",
            "1",
            outputFileName
        );

        try {
            const data = ffmpeg.FS("readFile", outputFileName);
            const url = URL.createObjectURL(
                new Blob([data.buffer], { type: "image/png" })
            );

            ffmpeg.FS("unlink", outputFileName);

            return url;
        } catch (e) {
            return `http://via.placeholder.com/${videoInfo.value.width}x${videoInfo.value.height}`;
        }
    };

    const selected = async (file: File) => {
        selectedFile.value = file;

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
        thumbnailTo.value = await getThumbnail(videoInfo.value.duration - 10);

        loading.value = null;
    };

    const changeStartTime = async (startTime: number) => {
        thumbnailFrom.value = await getThumbnail(startTime);
    };

    const changeEndTime = async (endTime: number) => {
        thumbnailTo.value = await getThumbnail(endTime);
    };

    const cutFormNextStep = async (startTime: number, endTime: number) => {
        cutStartTime.value = startTime;
        cutEndTime.value = endTime;

        const video = await convert();

        loading.value = "";

        if (!video) {
            alert("An error occurred while encoding the video.");
            cutStartTime.value = undefined;
            cutEndTime.value = undefined;

            return;
        }

        const link = document.createElement('a');
        link.href = video;
        link.download = "test.mp4";
        link.click();
        link.remove();
    };

    const convert = async () => {
        if (cutStartTime.value === undefined || cutEndTime.value === undefined || !ffmpeg.isLoaded()) return;

        const outputFileName = randomFileName("mp4");

        await ffmpeg.run(
            "-ss",
            String(cutStartTime.value / 100),
            "-to",
            String(cutEndTime.value / 100),
            "-i",
            inputFileName,
            outputFileName
        );

        const data = ffmpeg.FS("readFile", outputFileName);
        return URL.createObjectURL(
            new Blob([data.buffer], { type: "video/mp4" })
        );
    };

    const progressEvent = (ratio: number) => {
        if (cutStartTime.value === undefined || cutEndTime.value === undefined || !ffmpeg.isLoaded()) return;

        loading.value = `Creating video... (${Math.round(ratio * 100)}%)`;
    }
</script>

<template>
    <Logo text="Video Editor" class="mt-8 mb-16" />

    <FileSelectForm
        class="mx-auto max-w-4xl"
        @selected="selected"
        v-if="!selectedFile"
    />
    <Loading class="mx-auto max-w-4xl" v-if="loading">{{ loading }}</Loading>

    <CutForm
        v-if="thumbnailFrom && thumbnailTo && cutStartTime === undefined && cutEndTime === undefined"
        :thumbnailFrom="thumbnailFrom"
        :thumbnailTo="thumbnailTo"
        :duration="videoInfo.duration"
        @changeStartTime="changeStartTime"
        @changeEndTime="changeEndTime"
        @nextStep="cutFormNextStep"
    />
</template>
