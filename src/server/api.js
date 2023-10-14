
import express from 'express'
import fs from 'fs/promises'
import path from 'path'
// import multer from 'multer'

// import fontRenamer from '../lib/font-renamer.js'

// const upload = multer({ dest: 'uploads/' })
const router = express.Router()

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
