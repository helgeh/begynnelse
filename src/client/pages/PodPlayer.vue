<template>

	<div class="px-1 pb-16">

		<v-sheet
			elevation="12"
			:max-width="compact ? 600 : '80%'"
			rounded="lg"
			width="100%"
			color="rgb(54, 62, 70)"
			class="pa-4 mx-auto my-5"
		>

			<v-audio-player
				ref="player"
				:src="currentTrack"
				:track-title="showTitle"
				:track-subtitle="currentTitle"
				allow-previous
				allow-next
				:compact="compact"
				:autoplay="false"
				:start-time="startTime"
				:start-volume="vol"
				:album-art="albumArt"
				@next-audio="nextSrc()"
				@previous-audio="prevSrc()"
				@time-update="onTimeUpdate"
				@volume-change="onVolumeChange"
			></v-audio-player>

		</v-sheet>

		<v-sheet
			elevation="12"
			:max-width="compact ? 600 : '80%'"
			rounded="lg"
			width="100%"
			color="rgb(54, 62, 70)"
			class="pa-4 mx-auto my-5">
			
			<my-file-list 
				ref="fileList"
				v-if="showFileList"
				@clicked="onFileClicked" 
			></my-file-list>

		</v-sheet>

	</div>

</template>

<script setup>
	import { ref, computed, onMounted } from 'vue'
  	import { useDisplay } from 'vuetify'
	const { mdAndDown } = useDisplay()
	const showTitle = ref('Skuddet på Toftøy')
	const episodes = [
		{url: '/mp3/skuddet-pa-toftoy_ep1.mp3', title: 'Episode 1'},
		{url: '/mp3/skuddet-pa-toftoy_ep2.mp3', title: 'Episode 2'},
		{url: '/mp3/skuddet-pa-toftoy_ep3.mp3', title: 'Episode 3'},
		{url: '/mp3/skuddet-pa-toftoy_ep4.mp3', title: 'Episode 4'},
		{url: '/mp3/skuddet-pa-toftoy_ep5.mp3', title: 'Episode 5'},
		{url: '/mp3/skuddet-pa-toftoy_ep6.mp3', title: 'Episode 6'}
	]
	const player = ref(null)
	const startTime = ref(0)
	const vol = ref(0)

	const curIndex = ref(0)
	const currentTrack = computed(() => {
		return episodes[curIndex.value].url
	})
	const currentTitle = computed(() => {
		return episodes[curIndex.value].title
	})
	const albumArt = ref('/jpg/skuddet-pa-toftoy.jpg')
	const compact = ref(mdAndDown)
	function nextSrc() {
		const newVal = Math.min(curIndex.value + 1, episodes.length - 1)
		if (newVal !== curIndex.value) {
			curIndex.value = newVal
			setStoredEpisode(curIndex.value)
			setStoredTime(0)
		}
	}
	function prevSrc() {
		const newVal = Math.max(0, curIndex.value - 1)
		if (newVal !== curIndex.value) {
			curIndex.value = newVal
			setStoredEpisode(curIndex.value)
			setStoredTime(0)
		}
	}


	const fileList = ref(null)
	const showFileList = ref(true)
	const anchor = ref(null)

	function onFileClicked(data) {
		curIndex.value = data.index
		setStoredEpisode(curIndex.value)
		setStoredTime(0)
	}





	function throttle (callback, limit) {
	  var waiting = false;                      // Initially, we're not waiting
	  return function () {                      // We return a throttled function
	      if (!waiting) {                       // If we're not waiting
	          callback.apply(this, arguments);  // Execute users function
	          waiting = true;                   // Prevent future invocations
	          setTimeout(function () {          // After a period of time
	              waiting = false;              // And allow future invocations
	          }, limit);
	      }
	  }
	}

	const getStoredTime = () => parseInt(localStorage.getItem('curTime') * 100) / 100
	const setStoredTime = curTime => localStorage.setItem('curTime', curTime)

	const getStoredShow = () => localStorage.getItem('curShow')
	const setStoredShow = curShow => localStorage.setItem('curShow', curShow)

	const getStoredEpisode = () => localStorage.getItem('curEpisode')
	const setStoredEpisode = curEpisode => localStorage.setItem('curEpisode', curEpisode)

	const getStoredVolume = () => parseInt(localStorage.getItem('curVolume') * 100) / 100
	const setStoredVolume = curVolume => localStorage.setItem('curVolume', curVolume)

	function onTimeUpdate() {
		if (player.value.currentTime > 1)
			setStoredTime(player.value.currentTime)
	}

	function onVolumeChange() {
		setStoredVolume(player.value.volume)
	}

	onMounted(() => {
		fileList.value.load(episodes.map(ep => ({text: ep.title})))

		var e = getStoredEpisode()
		if (e !== null)
			curIndex.value = e
		else
			setStoredEpisode(curIndex.value)

		var t = getStoredTime()
		if (t > 0)
			startTime.value = t

		var v = getStoredVolume()
		if (v > 0)
			vol.value = v
	})

</script>

<style></style>