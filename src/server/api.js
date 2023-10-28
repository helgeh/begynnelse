
import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'
import 'dotenv/config'

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
		return res.send(ex.message)
	}
})

export default router
