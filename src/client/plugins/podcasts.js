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

const showSlugMap = {
    'spt': {
        title: 'Skuddet på Toftøy',
        icon: 'mdi-sail-boat'
    },
    'kmdtk': {
        title: 'Kvinden med den tunge kuffert',
        icon: 'mdi-bag-suitcase'
    }
}

export default {
 	install(app, options) {
    	
		app.provide('podcasts', {

			// PodcastShow,
			
			getShows: () => fetch('/podcasts')
				.then(res => res.json())
				.then(json => json.dirs
					.map(file => ({
						key: Date.now(),
						slug: file.slug,
						path: file.path,
		                title: showSlugMap[file.slug].title,
		                icon: showSlugMap[file.slug].icon
					}))
		            .filter(show => Object.keys(showSlugMap).indexOf(show.slug) >= 0)
		        ),

			getEpisodes: (slug) => fetch(`/podcasts/${slug}/episodes`)
				.then(res => res.json())
				.then(json => json.files.map(file => ({
					key: Date.now(),
					url: file.path,
					title: file.fileName.replace('ep', 'Episode ').replace('.mp3', ''),
					fileName: file.fileName
				}))),
		})
	}
}
