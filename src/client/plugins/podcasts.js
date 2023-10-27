import axios from 'axios'

// class PodcastPlayer {
// 	src = ''
// 	trackTitle = ''
// 	trackSubtitle = ''
// 	allowPrevious = false
// 	allowNext = true
// 	compact = false
// 	albumArt = ''
// 	autoplay = false
// 	startTime = 0
// 	startVolume = 20
// }

export default {
 	install(app, options) {
    	app
    	// .component('FontRenamer', FontRenamer)
    	// .component('MyHeader', MyHeader)
		// 	.component('MyForm', MyForm)
		// 	.component('MyFileList', MyFileList)
		// 	.component('MyAlert', MyAlert)
		// 	.component('MyPrompt', MyPrompt)
		// 	.component('VAudioPlayer', VuetifyAudioPlayer)
		// 	.component('CatTax', CatTax)

		app.provide('podcasts', {

			// PodcastShow,
			
			getShows: () => fetch('/podcasts')
				.then(res => res.json())
				// .then(json => {
				// 	console.log('got json', json)
				// 	return json
				// })
				.then(json => json.dirs.map(file => ({
					key: Date.now(),
					slug: file.slug,
					path: file.path
				}))),

			getEpisodes: (slug) => fetch(`/podcasts/${slug}/episodes`)
				.then(res => res.json())
				.then(json => json.files.map(file => ({
					key: Date.now(),
					url: file.path,
					title: file.fileName.replace('ep', 'Ep ').replace('.mp3', ''),
					fileName: file.fileName
				}))),

		    // miraSay: (data) => {
		    // 	return new Promise((resolve, reject) => {
		    // 		axios({
		    // 			url: '/mirasay',
		    // 			method: 'post',
		    // 			data: data
		    // 		})
			// 	      .then(response => {
			// 	        if (response && response.data) {
			// 	        	resolve(response.data)
			// 	        }
			// 	        else resolve({})
			// 	      })
			// 	      .catch(err => {
			// 			    reject(err && err.response || {})
			// 			    if (err && err.response) {
			// 					if (err.response.data instanceof Blob) {
			// 						const reader = new FileReader()
			// 						reader.onload = function() {
			// 							console.log(reader.result)
			// 						}
			// 						reader.readAsText(err.response.data)
			// 					}
			// 			    }
			// 	      })
			// 	    })
		    // },
		})
	}
}
