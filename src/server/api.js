import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'
import 'dotenv/config'
import parser from 'xml2json'

import { authTheToken, makeTheToken, checkPassword, randomHex, getPasswordComplexityScore } from './sikkerhet.js'
import { addUser, setUserDetails, removeUser, getUserByEmail, addLink, getLinks } from './db.js'
import { sendAdminMail } from './mailer.js'

const debug = process.env.DEBUG_APP || false

function log(...args) {
  if (debug)
    console.log(...args)
}

const TIME_5_MINUTES = 1000 * 60 * 5

const router = express.Router()

router.use(express.json())

function notifyEmailVerify(to, secret) {
  const url = `https://begy.nnel.se/?email=${to}&token=${secret}#/verify`
  sendAdminMail(
    to, 
    'Email verification', 
    `<p>To complete the begy.nnel.se registration <a href="${url}">click here</a> to verify your email address</p>`
  )
}

router.post('/blimed', async (req, res) => {
  const { usr, pw } = req.body
  const user = getUserByEmail(usr)
  if (user) {
    log(`Bruker fantes allerede (${usr})`)
    return res.status(409).json({ error: 'User exists' })
  }
  const reg = /^\S+@\S+\.\S+$/
  if (!reg.test(usr)) {
    log(`Registrering med ikke-epost? (${usr})`)
    return res.status(400).json({ error: 'Not a proper email address!' })
  }
  const score = getPasswordComplexityScore(pw)
  if (score < 3) {
    log(`For lav passord-kompleksitet`)
    return res.status(400).json({ error: 'Needs more password complexity', code: score })
  }
  const secret = randomHex(16)
  addUser(usr, pw,`et:${secret}-${Date.now()};`)
  notifyEmailVerify(usr, secret)
  log(`Bruker opprettet og epost sendt (${usr}, ${Date.now()})`)
  return res.json({ message: 'Registered!', success: true })
})

router.post('/blimed/godkjenn', async (req, res) => {
  const { usr, pw } = req.body
  const user = getUserByEmail(usr)
  if (!user || !user.password) {
    log(`Fant ingen bruker (${usr})`)
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  if (await !checkPassword(pw, user.password)) {
    log(`Feil passord for bruker (${usr})`)
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const secret = randomHex(16)
  setUserDetails(usr,`et:${secret}-${Date.now()};`)
  notifyEmailVerify(usr, secret)
  log(`Hemmelighet oppdatert og epost sendt (${usr}, ${Date.now()})`)
  return res.json({ message: 'Email sent', success: true })
})

router.get('/blimed/godkjenn/:email/:token', async (req, res) => {
  const email = req.params.email
  const token = req.params.token
  const user = getUserByEmail(email)
  if (user && user.details && user.details.startsWith(`et:${token}-`)) {
    const details = user.details.replace(`et:${token}-`, '')
    const digits = /^(\d)+/.exec(details)[0]
    if (Date.now() - parseInt(digits, 10) > TIME_5_MINUTES) {
      log(`For lang tid siden registrering (${email})`)
      return res.status(400).json({ error: 'Too much time passed' })
    }
    setUserDetails(email, `et:CONFIRMED-${Date.now()};`)
    return res.json({ message: 'Verified!', success: true })
  }
  log(`Feil hemmelighet for bruker (${email})`)
  return res.status(400).json({ error: 'Not valid token' })
})

router.post('/heisann', async (req, res) => {
  const { usr, pw } = req.body
  const user = getUserByEmail(usr)
  if (!user || !user.password) {
    log(`Fant ingen bruker (${usr})`)
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  if (await checkPassword(pw, user.password)) {
    if (!user.details.startsWith('et:CONFIRMED-')) {
      log(`Bruker allerede godkjent (${usr})`)
      return res.status(403).json({ error: 'Email not verified' })
    }
    const token = makeTheToken(user.id, user.email)
    return res.json({ token })
  }
  log(`Feil usr/pw (${usr})`)
  return res.status(401).json({ error: 'Invalid credentials' })
})

router.post('/slettmeg', authTheToken, (req, res) => {
  const result = removeUser(req.user.id)
  log(`Bruker slettet (${result.id, result.email})`)
  res.json(result)
})

router.get('/lenker', authTheToken, (req, res) => {
  const links = getLinks(req.user.id)
  res.json(links)
})

router.post('/lenker', authTheToken, (req, res) => {
  const { url, title, category, tags } = req.body
  const result = addLink(title, url, req.user.id)
  res.json({ success: true })
})

router.post('/lenker/:id', authTheToken, (req, res) => {
  const { url, title, category, tags } = req.body
  const result = updateLink({title, url, category, tags}, req.user.id)
  res.json({ success: true })
})

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

router.get('/podcasts', function (req, res, next) {
  const mp3Dir = path.join(path.resolve(), 'public', 'mp3')
  const result = []
  fs.readdir(mp3Dir)
    .then(async (files) => {
      const dirs = []
      for (let i = 0; i < files.length; i++) {
        const stat = await fs.lstat(path.join(mp3Dir, files[i]))
        if (stat.isDirectory()) dirs.push(files[i])
      }
      return dirs
    })
    .then((dirs) =>
      dirs.map((dir) => ({
        path: path.join('/mp3', dir),
        slug: dir,
        episodes: [],
      })),
    )
    .then((dirs) => res.json({ dirs }))
})

router.get('/podcasts/:slug/episodes', async function (req, res, next) {
  const slug = req.params.slug
  const showDir = path.join(path.resolve(), 'public', 'mp3', slug)
  try {
    const showStat = await fs.lstat(showDir)
    if (!showStat.isDirectory()) return res.send(404)
    fs.readdir(showDir)
      .then((files) => files.filter((file) => /.mp3$/.test(file)))
      .then((files) =>
        files.map((file) => ({
          path: path.join('/mp3', slug, file),
          fileName: file,
        })),
      )
      .then((files) => res.json({ files }))
  } catch (ex) {
    return res.status(404).send({ files: [] })
  }
})

router.get('/rss', function (req, res, next) {
  res.json({ dirs: Object.keys(xmlMap).map((k) => ({ slug: k })) })
})

router.get('/rss/:slug/episodes', async function (req, res, next) {
  const slug = req.params.slug

  const xmlData = xmlMap[slug]
  if (!xmlData || xmlData.length < 1) return res.status(404).send('Not found')

  const xmlFile = fs
    .readFile(path.resolve(`./src/server/${slug}.xml`), 'utf8')
    .then((file) => {
      const json = parser.toJson(file)
      res.json({
        files: JSON.parse(json)
          .rss.item.map((item) => ({
            path: item.enclosure.url,
            fileName: item.title,
            image: item['itunes:image'].href,
          }))
          .reverse(),
      })
    })
    .catch((err) => {
      console.log(err)
      return res.status(404).send({ files: [] })
    })
})

export default router

const xmlMap = {
  rbeai: 'Roger Bullman - Etterlyst av Interpol',
  kak: 'Kongen av Kongsberg',
  tom: 'Torpedoen og Milliardæren',
  stdmeb: 'Skyldig til det motsatte er bevist',
}
