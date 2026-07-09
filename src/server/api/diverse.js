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
        files.map((file) => ({
          path: path.join('/zips', file),
          fileName: file,
        })),
      )
      .then((files) => res.json({ files }))
      .catch((err) => {
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

  router.get('/jegvilspille/:name', async function (req, res, next) {
    const mcName = req.params.name
    // const theirIp = '' + req.ip
    // const origHost = '' + req.header('x-original-host')
    const forwardedIp = '' + (req.header('x-forwarded-for') ?? req.header('x-original-host') ?? req.ip)
    if (!forwardedIp)
      return res.status(404).json({ msg: 'Hmm, fant ikke no ip gitt' })
    const playersFile = path.join(path.resolve(), 'localfiles', 'players.json')
    try {
      const stat = await fs.stat(playersFile)
      if (!stat) {
        console.log('jøss, ingen stat response?', playersFile, stat)
        return res.status(404).json({ msg: 'Playerslist mangler visst... ikke satt opp prosjektet riktig kanskje'})
      }
    }
    catch (e) {
      console.log('lese playersfil feila!', playersFile, e.message)
      return res.status(404).json({ msg: 'Playerslist mangler visst... ikke satt opp prosjektet riktig kanskje'})
    }
    const allPlayers = JSON.parse(await fs.readFile(playersFile))
    const names = allPlayers.map(pl => pl.name)
    if (!names.includes(mcName))
      return res.status(404).json({msg: 'Sorry but nope'})
    allPlayers.find(pl => pl.name === mcName).ip = forwardedIp
    await fs.writeFile(playersFile, JSON.stringify(allPlayers, null, 2))
    res.json({
      msg: 'Ok gutta',
      test: {
        mcName,
        // theirIp,
        // forwardedIp,
        // origHost
      }
    })
//<<<<<<< Updated upstream
  })
//=======

//    router.get('/ziplist', function (req, res, next) {
//      const z = path.join(path.resolve(), 'public', 'zips')
//      const result = []
//      fs.readdir(z)
//        .then((files) => files.filter((file) => /.zip$/.test(file)))
//        .then((files) =>
//          files.map((file) => ({ path: path.join('/zips', file), fileName: file })),
//        )
//        .then((files) => res.json({ files }))
//        .catch(err => {
//          res.json({ files: [] })
//        })
//    })
//
//    router.get('/videolist', function (req, res, next) {
//      const z = path.join(path.resolve(), 'public', 'videos')
//      const result = []
//      fs.readdir(z)
//        .then((files) => files.filter((file) => /.mp4$/.test(file)))
//        .then((files) =>
//          files.map((file) => ({
//            path: path.join('/videos', file),
//            fileName: file,
//          })),
//        )
//        .then((files) => res.json({ files }))
//        .catch(function (err) {
//          console.log(err)
//          res.json({ files: [] })
//        })
//    })

    router.get('/ppplist', function (req, res, next) {
      const z = path.join(path.resolve(), 'public', 'test', 'ppp')
      const result = []
      fs.readdir(z)
        .then((files) => files.filter((file) => /.jpg$/.test(file) || /.png$/.test(file)))
        .then((files) =>
          files.map((file) => ({
            path: path.join('/test/ppp', file),
            fileName: file,
          })),
        )
        .then((files) => res.json({ files }))
        .catch(function (err) {
          console.log(err)
          res.json({ files: [] })
        })
    })

//>>>>>>> Stashed changes
}
