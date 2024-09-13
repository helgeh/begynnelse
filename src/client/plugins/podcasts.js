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
    },
    'rbeai': {
        title: 'Roger Bullman: Etterlyst av Interpol',
        icon: 'mdi-incognito'
    },
    'kak': {
        title: 'Kongen av Kongsberg',
        icon: 'mdi-crown'
    },
    'tom': {
    	title: 'Torpedoen og Milliardæren',
    	icon: 'mdi-cash-multiple'
    },
    'stdmeb': {
    	title: 'Skyldig til det motsatte er bevist',
    	icon: 'mdi-redhat'
    },
    'tkht': {
        title: 'Tore Karlsen - Helvetesturen',
        icon: 'mdi-fire'
    }
}

export default {
 	install(app, options) {

 		function getRssItems(slug) {
 			return fetch(`/rss/${slug}/episodes`)
				.then(res => res.json())
				.then(json => json.files.map(file => ({
					key: Date.now, 
					url: file.path,
					title: file.fileName.replace(showSlugMap[slug].title + ' ', ''),
					fileName: file.fileName,
					image: file.image
				})))
		}
    	
		app.provide('podcasts', {

			// PodcastShow,
			
			getShows: () => fetch('/podcasts')
				.then(res => res.json())
				.then(json => json.dirs
		            .filter(show => Object.keys(showSlugMap).indexOf(show.slug) >= 0)
					.map(file => ({
						key: Date.now(),
						slug: file.slug,
						path: file.path,
		                title: showSlugMap[file.slug].title,
		                icon: showSlugMap[file.slug].icon
					}))
		        ),

			getEpisodes: (slug, isRss) => {
				if (isRss)
					return getRssItems(slug)
				return fetch(`/podcasts/${slug}/episodes`)
					.then(res => res.json())
					.then(json => json.files.map(file => ({
						key: Date.now(),
						url: file.path,
						title: file.fileName.replace('ep', 'Episode ').replace('.mp3', ''),
						fileName: file.fileName
					})))
				},

			getRss: () => fetch('/rss')
				.then(res => res.json())
				.then(json => json.dirs
					.map(file => ({
						key: Date.now(),
						slug: file.slug,
		                title: showSlugMap[file.slug].title,
		                icon: showSlugMap[file.slug].icon,
		                isRss: true
					}))
				),

			getRssItems: (slug) => fetch(`/rss/${slug}/episodes`)
				.then(res => res.json())
				.then(json => json.files.map(file => ({
					key: Date.now, 
					url: file.path,
					title: file.fileName.replace(showSlugMap[slug].title + ' ', ''),
					fileName: file.fileName
				})))
		})
	}
}
