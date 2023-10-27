<template>
    <v-card
        class=""
        ref="playerContainer"
        :loading="!audioDownloaded"
        v-bind="$attrs"
    >
        <v-img
            v-if="albumArt && compact"
            :src="albumArt"
            aspect-ratio="1"
            contain
            class="grey darken-3 px-16 pb-8 pt-4"
        ></v-img>

        <audio
            ref="audio"
            @pause="playing = false"
            @play="playing = true"
            @timeupdate="handleTimeUpdate"
            @durationchange="setDuration"
            @canplaythrough="audioDownloaded = true"
            @ended="handleAudioEnd"
            @error="emit('error', $event)"
            :muted="muted"
            :src="src"
        ></audio>

        <v-slider
            class="audio-seeker mx-5"
            v-if="src"
            min="0"
            max="1000000"
            @update:model-value="handleSliderInput($event)"
            v-model="sliderVal"
            hide-details="true"
        ></v-slider>

        <v-card-text>
            <v-row
                class="pb-5"
                :class="compact ? 'text-center' : 'text-left'"
                align="center"
                justify="center"
            >
                <v-col :cols="compact ? 12 : 6" class="d-flex align-center">
                    <v-avatar tile class="d-inline-block" v-if="albumArt && !compact">
                        <v-img :src="albumArt" aspect-ratio="1"></v-img>
                    </v-avatar>

                    <div
                        class="mx-auto"
                        :class="albumArt && !compact && 'ml-3 d-inline-block'"
                    >
                        <span v-if="trackTitle" class="d-block" v-text="trackTitle"></span>
                        <span
                            v-text="trackSubtitle"
                            class="d-block text-uppercase font-weight-bold"
                            style="letter-spacing: 0.05em"
                        ></span>
                    </div>
                </v-col>

                <v-spacer></v-spacer>

                <v-col :cols="compact ? 12 : 2">
                    <div
                        class="d-flex align-top mx-auto"
                        :class="compact ? 'justify-center' : 'justify-end'"
                        style="max-width: 12rem"
                    >
                        <v-btn icon @click="muted = !muted" size="small">
                            <v-icon>{{volumeIcon}}</v-icon>
                        </v-btn>

                        <v-slider
                            class="mt-1 volume-slider"
                            :value="muted ? 0 : volume"
                            v-model="volume"
                            max="100"
                            min="0"
                            hide-details="true"
                        ></v-slider>
                    </div>
                </v-col>

                <v-col
                    v-if="src"
                    :cols="compact ? 12 : 4"
                    class="d-flex align-center"
                    :class="compact ? 'justify-center' : 'justify-end'"
                >
                    <div :class="compact ? 'mx-1' : 'mx-2'">
                        <v-btn
                            size="small"
                            icon
                            :disabled="!audioDownloaded || !allowPrevious"
                            @click="emit('previous-audio')"
                        >
                            <v-icon size="20">mdi-skip-previous</v-icon>
                        </v-btn>
                    </div>

                    <div :class="compact ? 'mx-1' : 'mx-2'">
                        <v-btn
                            size="small"
                            icon
                            :disabled="!audioDownloaded"
                            @click="forwardSeconds(-5)"
                        >
                            <v-icon size="20">mdi-rewind-5</v-icon>
                        </v-btn>
                    </div>

                    <div :class="compact ? 'mx-2' : 'mx-3'">
                        <v-btn
                            size="small"
                            icon
                            :disabled="!audioDownloaded"
                            @click="playing = !playing"
                        >
                            <v-icon size="30">{{playing ? 'mdi-pause' : 'mdi-play'}}</v-icon>
                        </v-btn>
                    </div>

                    <div :class="compact ? 'mx-1' : 'mx-2'">
                        <v-btn
                            size="small"
                            icon
                            :disabled="!audioDownloaded"
                            @click="forwardSeconds(15)"
                        >
                            <v-icon size="20">mdi-fast-forward-15</v-icon>
                        </v-btn>
                    </div>

                    <div :class="compact ? 'mx-1' : 'mx-2'">
                        <v-btn
                            size="small"
                            icon
                            :disabled="!audioDownloaded || !allowNext"
                            @click="emit('next-audio')"
                        >
                            <v-icon size="20">mdi-skip-next</v-icon>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup>
    import { throttle } from 'lodash'
    import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

    const props = defineProps({
        src: { type: String, default: '' },
        trackTitle: { type: String },
        trackSubtitle: { type: String, default: undefined },
        allowPrevious: { type: Boolean, default: false },
        allowNext: { type: Boolean, default: false },
        compact: { type: Boolean, default: false },
        albumArt: { type: String, default: undefined },
        autoplay: { type: Boolean, default: false },
        startTime: { type: Number, default: 0 },
        startVolume: { type: Number, default: 20 },
    })

    const emit = defineEmits([
        'error',
        'previous-audio',
        'next-audio',
        'time-update',
        'volume-change'
    ])

    const audioDownloaded = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const playing = ref(false)
    const volume = ref(0)
    const seekerFocused = ref(false)
    const muted = ref(false)
    const sliderVal = ref(0)

    const audio = ref(null)

    const volumeIcon = computed(() => {
        if (muted.value) {
            return 'mdi-volume-off'
        } else if (volume.value === 0) {
            return 'mdi-volume-low'
        } else if (volume.value >= 50) {
            return 'mdi-volume-high'
        } else {
            return 'mdi-volume-medium'
        }
    })

    watch(playing, async (newState, oldState) => {
        if (newState)
            return audio.value.play()
        audio.value.pause()
        emit('time-update', audio.value.currentTime)
    })

    watch(audioDownloaded, async (isDone, oldState) => {
        if (!playing.value) {
            currentTime.value = props.startTime
            audio.value.currentTime = currentTime.value
        }
        if (props.autoplay && isDone) {
            playing.value = true
        }
    })

    watch(
        () => props.src,
        async (newSrc, oldSrc) => {
            if (newSrc) {
                audioDownloaded.value = false
                playing.value = false
            }
        }
    )

    watch(
        () => props.startTime,
        (val) => {
            currentTime.value = val
            audio.value.currentTime = val
        }
    )

    watch(
        () => props.startVolume,
        (val) => {
            if (val > 0) {
                volume.value = val
            }
        }
    )

    watch(volume, async (newVolume, oldVolume) => {
        if (newVolume > 0)
            muted.value = false
        audio.value.volume = newVolume / 100
        emit('volume-change', Math.round(newVolume * 100) / 100)
    })

    watch(sliderVal, async (timePercent, oldVal) => {
        if (seekerFocused.value) {
            audio.value.currentTime = audio.value.duration * (timePercent / 1000000.0)
        }
    })

    function handleSliderInput(val) {
        throttledSlider(val)
    }

    function forwardSeconds(seconds) {
        let newTimestamp = currentTime.value + seconds

        if (newTimestamp < 0) {
            newTimestamp = 0
        } else if (newTimestamp > duration.value) {
            newTimestamp = duration.value
        }

        audio.value.currentTime = newTimestamp
        emit('time-update', audio.value.currentTime)
    }

    function setDuration() {
        duration.value = audio.value.duration
    }

    function handleTimeUpdate() {
        if (!audio.value)
            return
        currentTime.value = audio.value.currentTime
        sliderVal.value = parseInt((currentTime.value / duration.value) * 1000000) || 0
        throttledTimeUpdate(currentTime.value)
    }

    function handleAudioEnd() {
        if (allowNext.value) {
            emit('next-audio')
        }
    }

    let keydownListener, throttledTimeUpdate, throttledSlider
    onMounted(() => {
        volume.value = props.startVolume

        throttledTimeUpdate = throttle(function (time) {
            if (playing.value)
                emit('time-update', time)
        }, 5000)

        throttledSlider = throttle(function (val) {
            if (!audio.value)
                return
            audio.value.currentTime = audio.value.duration * (val / 1000000.0)
            emit('time-update', audio.value.currentTime)
        }, 100)

        keydownListener = document.addEventListener("keydown", (event) => {
            if (event.keyCode === 32) {// && seekerFocused) {
                event.preventDefault()
                playing = !playing
            }
        })
    })

    onBeforeUnmount(() => {
        document.removeEventListener("keydown", keydownListener)
    })

</script>

<style>
.volume-slider .v-messages {
  display: none; }

.audio-seeker .v-slider {
  min-height: 0; }

.audio-seeker .v-slider--horizontal {
  margin-left: 0;
  margin-right: 0; }

.audio-seeker .v-slider__track-background {
  width: 100% !important; }

.audio-seeker .v-messages {
  display: none; }

.audio-seeker .v-slider__thumb:before {
  opacity: 0; }

.audio-seeker .v-slider__thumb {
  height: 10px;
  width: 10px;
  cursor: pointer; }

.audio-seeker .v-slider__track-container {
  cursor: pointer;
  height: 6px !important; }

.audio-seeker .v-slider__track-fill,
.audio-seeker .v-slider__track-background,
.audio-seeker .v-slider__track-container {
  border-radius: 9999px; }

.audio-seeker * {
  transition: none !important; }

</style>