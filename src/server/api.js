
import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'
import 'dotenv/config'
import parser from 'xml2json'

const router = express.Router()

router.use(express.json())

router.post('/mirasay', (req, res) => {
    const miramessage = req.body && req.body.message || ''
	
	const webHookKey = process.env.WEBHOOK_KEY || ''
	const hookUrl = `https://discord.com/api/webhooks/${webHookKey}`
	// const hookUrl = 'http://echo.jsontest.com/'
	const data = {
		content: miramessage
	}

	axios.post(hookUrl, data, {
	  headers: {
	    'Content-Type': 'application/json'
	  }
	})
	  .then(function (response) {
	    res.json({success: true})
	  })
	  .catch(function (error) {
	    res.status(500).send("Huff, noe gikk visst galt på vei til Discord...")
	  })
})

router.get('/ziplist', function (req, res, next) {
    const z = path.join(path.resolve(), 'public', 'zips')
    const result = []
    fs.readdir(z)
        .then(files => files.filter(file => /.zip$/.test(file)))
        .then(files => files.map(file => ({path: path.join('/zips', file), fileName: file})))
        .then(files => res.json({ files }))
})

router.get('/podcasts', function (req, res, next) {
    const mp3Dir = path.join(path.resolve(), 'public', 'mp3')
    const result = []
    fs.readdir(mp3Dir)
        .then(async files => {
        	const dirs = []
        	for (let i = 0; i < files.length; i++) {
        		const stat = await fs.lstat(path.join(mp3Dir, files[i]))
        		if (stat.isDirectory())
        			dirs.push(files[i])
        	}
        	return dirs
        })
        .then(dirs => dirs.map(dir => ({path: path.join('/mp3', dir), slug: dir, episodes: []})))
        .then(dirs => res.json({ dirs }))
})

router.get('/podcasts/:slug/episodes', async function (req, res, next) {
	const slug = req.params.slug
    const showDir = path.join(path.resolve(), 'public', 'mp3', slug)
    try {
	    const showStat = await fs.lstat(showDir)
	    if (!showStat.isDirectory())
	    	return res.send(404)
	    fs.readdir(showDir)
	        .then(files => files.filter(file => /.mp3$/.test(file)))
	        .then(files => files.map(file => ({path: path.join('/mp3', slug, file), fileName: file})))
	        .then(files => res.json({ files }))
	}
	catch (ex) {
		return res.status(404).send({files: []})
	}
})

router.get('/rss', function (req, res, next) {
	res.json({dirs: ['rbeai', 'kak', 'tom'].map(k => ({slug: k}))})
})

router.get('/rss/:slug/episodes', async function (req, res, next) {
	const slug = req.params.slug

	const xmlData = xmlMap[slug]
	if (!xmlData || xmlData.length < 1)
		return res.status(404).send('Not found')

	const xmlFile = fs.readFile(path.resolve(`./src/server/${slug}.xml`), 'utf8')
		.then(file => {
			const json = parser.toJson(file)
			res.json({
				files: JSON.parse(json).rss.item.map(item => ({
						path: item.enclosure.url, 
						fileName: item.title,
						image: item['itunes:image'].href
					})).reverse()
			})
		})
		.catch(err => {
			console.log(err)
			return res.status(404).send({files: []})
		});
})

export default router

const xmlMap = {
	rbeai: 'Roger Bullman - Etterlyst av Interpol',
	kak: 'Kongen av Kongsberg',
	tom: 'Torpedoen og milliard&aelig;ren'
}