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
      @error="$emit('error', $event)"
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
              @click="$emit('previous-audio')"
            >
              <v-icon size="20">{{ prevTrackIcon }}</v-icon>
            </v-btn>
          </div>

          <div :class="compact ? 'mx-1' : 'mx-2'">
            <v-btn
              size="small"
              icon
              :disabled="!audioDownloaded"
              @click="forwardSeconds(-5)"
            >
              <v-icon size="20">{{ backForwardIcon }}</v-icon>
            </v-btn>
          </div>

          <div :class="compact ? 'mx-2' : 'mx-3'">
            <v-btn
              size="small"
              icon
              :disabled="!audioDownloaded"
              @click="playing = !playing"
            >
              <v-icon size="30">{{playing ? pauseIcon : playIcon}}</v-icon>
            </v-btn>
          </div>

          <div :class="compact ? 'mx-1' : 'mx-2'">
            <v-btn
              size="small"
              icon
              :disabled="!audioDownloaded"
              @click="forwardSeconds(15)"
            >
              <v-icon size="20">{{ fastForwardIcon }}</v-icon>
            </v-btn>
          </div>

          <div :class="compact ? 'mx-1' : 'mx-2'">
            <v-btn
              size="small"
              icon
              :disabled="!audioDownloaded || !allowNext"
              @click="$emit('next-audio')"
            >
              <v-icon size="20">{{ nextTrackIcon }}</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { throttle } from 'lodash'

export default {
  props: {
    src: { type: String },
    trackTitle: { type: String },
    trackSubtitle: { type: String, default: undefined },
    allowPrevious: { type: Boolean, default: false },
    allowNext: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
    albumArt: { type: String, default: undefined },
    autoplay: { type: Boolean, default: false },
    startTime: { type: Number, default: 0 },
    startVolume: { type: Number, default: 0 },
    // icons
    prevTrackIcon: { type: String, default: "mdi-skip-previous" },
    nextTrackIcon: { type: String, default: "mdi-skip-next" },
    backForwardIcon: { type: String, default: "mdi-rewind-5" },
    fastForwardIcon: { type: String, default: "mdi-fast-forward-15" },
    playIcon: { type: String, default: "mdi-play" },
    pauseIcon: { type: String, default: "mdi-pause" },
    muteVolumeIcon: { type: String, default: "mdi-volume-off" },
    lowVolumeIcon: { type: String, default: "mdi-volume-low" },
    mediumVolumeIcon: { type: String, default: "mdi-volume-medium" },
    highVolumeIcon: { type: String, default: "mdi-volume-high" },
  },
  data() {
    return {
      audioDownloaded: false,
      currentTime: 0,
      duration: 0,
      playing: false,
      volume: 20,
      seekerFocused: false,
      keydownListener: null,
      muted: false,
      sliderVal: 0
    };
  },
  watch: {
    playing(value) {
      if (value) {
        return this.$refs.audio.play();
      }
      this.$refs.audio.pause();
    },
    muted(value) {
      this.$refs.audio.muted = value;
    },
    audioDownloaded(value) {
      if (this.autoplay) {
        if (value) {
          this.playing = true;
        }
      }
    },
    src(value) {
      if (value) {
        this.audioDownloaded = false;
        this.playing = false;
      }
    },
    startTime(value) {
      if (value > 1) {
        this.currentTime = value;
        this.$refs.audio.currentTime = this.currentTime
      }
    },
    startVolume(value) {
      if (value > 0) {
        this.volume = value;
        this.$refs.audio.volume = this.volume / 100;
      }
    },
    volume(val) {
      this.muted = false;
      this.$refs.audio.volume = val / 100;
      this.$emit('volume-change')
    },
    sliderVal(timePercent) {
      if (this.seekerFocused) {
        this.$refs.audio.currentTime =
          this.$refs.audio.duration * (timePercent / 1000000.0)
      }
    }
  },
  computed: {
    volumeIcon() {
      if (this.muted) {
        return this.muteVolumeIcon;
      } else if (this.volume === 0) {
        return this.lowVolumeIcon;
      } else if (this.volume >= 50) {
        return this.highVolumeIcon;
      } else {
        return this.mediumVolumeIcon;
      }
    }
  },
  methods: {
    handleSliderInput(val) {
      this.throttledSlider(val)
    },
    forwardSeconds(seconds) {
      let newTimestamp = this.currentTime + seconds;

      if (newTimestamp < 0) {
        newTimestamp = 0;
      } else if (newTimestamp > this.duration) {
        newTimestamp = this.duration;
      }

      this.$refs.audio.currentTime = newTimestamp;
      this.$emit('time-update')
    },
    setDuration() {
      this.duration = this.$refs.audio.duration;
    },
    handleTimeUpdate() {
      this.currentTime = this.$refs.audio.currentTime;
      this.sliderVal = parseInt((this.currentTime / this.duration) * 1000000) || 0
      this.throttledTimeUpdate()
    },
    handleAudioEnd() {
      if (this.allowNext) {
        this.$emit("next-audio");
      }
    },
  },
  mounted() {
    this.$refs.audio.volume = this.volume / 100;
    this.muted = this.$refs.audio.muted;

    this.throttledTimeUpdate = throttle(function () {
      this.$emit('time-update')
    }, 5000)

    this.throttledSlider = throttle(function (val) {
      if (!this.$refs.audio)
        return
      this.$refs.audio.currentTime =
        this.$refs.audio.duration * (val / 1000000.0)
      this.$emit('time-update')
    }, 100)

    this.keydownListener = document.addEventListener("keydown", (event) => {
      if (event.keyCode === 32) {// && this.seekerFocused) {
        event.preventDefault();
        this.playing = !this.playing;
      }
    });
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keydownListener);
  },
};
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