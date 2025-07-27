import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'

export default function configure(router) {
    
    router.post('/mirasay', (req, res) => {
      const miramessage = (req.body && req.body.message) || ''

      const webHookKey = process.env.WEBHOOK_KEY || ''
      const hookUrl = `https://discord.com/api/webhooks/${webHookKey}`
      // const hookUrl = 'http://echo.jsontest.com/'
      const data = {
        content: miramessage,
      }

      axios
        .post(hookUrl, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          res.json({ success: true })
        })
        .catch(function (error) {
          res.status(500).send('Huff, noe gikk visst galt på vei til Discord...')
        })
    })

    router.get('/ziplist', function (req, res, next) {
      const z = path.join(path.resolve(), 'public', 'zips')
      const result = []
      fs.readdir(z)
        .then((files) => files.filter((file) => /.zip$/.test(file)))
        .then((files) =>
          files.map((file) => ({ path: path.join('/zips', file), fileName: file })),
        )
        .then((files) => res.json({ files }))
        .catch(err => {
          res.json({ files: [] })
        })
    })

    router.get('/videolist', function (req, res, next) {
      const z = path.join(path.resolve(), 'public', 'videos')
      const result = []
      fs.readdir(z)
        .then((files) => files.filter((file) => /.mp4$/.test(file)))
        .then((files) =>
          files.map((file) => ({
            path: path.join('/videos', file),
            fileName: file,
          })),
        )
        .then((files) => res.json({ files }))
        .catch(function (err) {
          console.log(err)
          res.json({ files: [] })
        })
    })

}
