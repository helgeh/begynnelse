
import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'
import 'dotenv/config'
// import multer from 'multer'

// import fontRenamer from '../lib/font-renamer.js'

// const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.use(express.json())

// const cleanUploads = () => {
//     const p = path.join(path.resolve(), 'uploads')
//     fs.readdir(p)
//         .then(files => {
//             files.forEach(file => {
//                 if (file !== '.gitignore')
//                     fs.unlink(path.join(p, file))
//             })
//         })
// }

router.post('/mirasay', (req, res) => {
    const miramessage = req.body && req.body.message || ''
	// console.log('mira sier: ' + miramessage, req.body)
	
	const webHookKey = process.env.WEBHOOK_KEY || ''
	const hookUrl = `https://discord.com/api/webhooks/${webHookKey}`
	// const hookUrl = 'http://echo.jsontest.com/'
	const data = {
		// content: 'Voff voff!'
		content: miramessage
	}

	axios.post(hookUrl, data, {
	  headers: {
	    'Content-Type': 'application/json'
	  }
	})
	  .then(function (response) {
	    // console.log(response.data)
	    // res.json(response.data)
	    res.json({success: true})
	  })
	  .catch(function (error) {
	    // console.log(error)
	    res.status(500).send("Huff, noe gikk visst galt på vei til Discord...")
	  })

	    // res.status(500).send("Nei og nei nå gikk det på tverke her!")



	// res.json({data: 'javel'})
})

// router.post('/upload', upload.array('filer', 32), function (req, res, next) {
//     const nyttnavn = req.body && req.body.nyttnavn || ''
//     let cmd = 'python3 fontname.py ' + nyttnavn
//     let toZip = []
//     if (req.files && req.files.length < 1 || nyttnavn.length < 1) {
//         res.status(400).send('Filer eller filnavn mangler.')
//         return
//     }
//     req.files.forEach(file => {
//         toZip.push(file)
//         cmd += ' ' + file.path
//     })
//     fontRenamer.callFontnameScript(cmd)
//         .then(oldName => {
//             const newZipFile = path.join(path.resolve(), 'public', 'zips', `${nyttnavn}.zip`)
//             return fontRenamer.zipFiles(toZip, newZipFile)
//                 .then(_ => {
//                     res.json({downloadUrl: `/zips/${nyttnavn}.zip`})
//                     cleanUploads()
//                 })
//         })
//         .catch(err => {
//             res.status(500).send(err)
//         })
// })

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

// router.get('/ziplist', function (req, res, next) {
//     const z = path.join(path.resolve(), 'public', 'zips')
//     const result = []
//     fs.readdir(z)
//         .then(files => {
//             files.forEach(file => {
//                 const reg = /.zip$/
//                 if (reg.test(file)) {
//                     result.push({
//                         path: path.join('/zips', file),
//                         fileName: file
//                     })
//                 }
//             })
//             res.json({ files: result })
//         })
// })

// router.get('/removeZip', function (req, res, next) {
//     const z = path.join(path.resolve(), 'public', 'zips')
//     let result = false
//     fs.readdir(z)
//         .then(files => {
//             files.forEach(file => {
//                 const reg = /.zip$/
//                 if (!result && reg.test(file)) {
//                     if (file.replace(reg, '') === req.query.zipName) {
//                         fs.unlink(path.join(z, file))
//                         result = true
//                     }
//                 }
//             })
//             if (!result)
//                 res.status(500).send('Fant ikke filen')
//             else
//                 res.json({ ok: result })
//         })
// })

export default router
