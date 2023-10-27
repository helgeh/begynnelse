
export default {
 	install(app, options) {
 		const curSet = {
 			slug: ''
 		}
    	app.provide('storage', {
			getStoredTime() {
				if (this.usesSettings(curSet.slug))
					return getPodShowValues(curSet.slug).time
				return parseInt(localStorage.getItem('curTime') * 100) / 100
			},
			setStoredTime(curTime) {
				const vals = this.getPodShowValues(curSet.slug)
				vals.time = curTime
				this.setPodShowValues(curSet.slug, vals)
			},
			getStoredShow() {
				const slug = this.getPodSettings().showSlug
				curSet.slug = slug
				return slug
			},
			setStoredShow(curShow) {
				curSet.slug = curShow
				const obj = this.getPodSettings()
				obj.showSlug = curShow
				this.setPodSettings(obj)
			},
			getStoredEpisode() {
				if (this.usesSettings(curSet.slug))
					return getPodShowValues(curSet.slug).episode
				return parseInt(localStorage.getItem('curEpisode') * 100) / 100
			},
			setStoredEpisode(curEpisode) {
				const vals = this.getPodShowValues(curSet.slug)
				vals.episode = curEpisode
				this.setPodShowValues(curSet.slug, vals)
			},
			getStoredVolume() {
				if (this.getPodSettings().volume !== undefined)
					return this.getPodSettings().volume || 0
				return parseInt(localStorage.getItem('curVolume') * 100) / 100
			},
			setStoredVolume(curVolume) {
				const obj = this.getPodSettings()
				obj.volume = curVolume
				this.setPodSettings(obj)
			},
			getPodSettings() {
				const obj = JSON.parse(localStorage.getItem('pod.settings'))
				return obj || {}
			},
			setPodSettings(obj) {
				const json = JSON.stringify(obj)
				localStorage.setItem('pod.settings', json)
			},
			usesSettings(slug) {
				const keys = Object.keys(this.getPodSettings())
				if (keys.length < 1) {
					return false
				}
				return keys.indexOf(slug) >= 0
			},
			getPodShowValues(slug) {
				const obj = this.getPodSettings()
				return obj[slug] || (obj[slug] = {})
			},
			setPodShowValues(slug, values) {
				const obj = this.getPodSettings()
				obj[slug] = (values || {})
				this.setPodSettings(obj)
			},
			convertIfFresh(slug) {
				if (this.usesSettings(slug))
					return
				const freshValues = {
					episode: this.getStoredEpisode() || 0,
					time: this.getStoredTime() || 0
				}
				const vol = this.getStoredVolume() || 20
				this.setStoredShow(slug)
				this.setStoredVolume(vol)
				this.setPodShowValues(slug, freshValues)
				localStorage.removeItem('curTime')
				localStorage.removeItem('curEpisode')
				localStorage.removeItem('curVolume')
			}
		})
	}
}
