import { authTheToken, makeTheToken, checkPassword, randomHex, getPasswordComplexityScore } from '../sikkerhet.js'
import { addUser, setUserDetails, removeUser, getUserByEmail, getUserById, addLink, getLinks } from '../db.js'
import { sendAdminMail } from '../mailer.js'
import config from '../config.js'
import { log } from '../logger.js'

export default function configure(router) {

  async function slowResponse() {
    return new Promise(res => {
      setTimeout(res, 1250)
    })
  }

  function notifyEmailVerify(to, secret) {
    const url = `https://begy.nnel.se/?email=${to}&token=${secret}#/verify`
    if (process.env.DEVELOP) {
      console.log('SKIPPING EMAIL VERIFY BECAUSE WE ARE IN DEVELOP')
      console.log(`URL to click: ${url}`)
      return
    }
    sendAdminMail(
      to, 
      'Email verification', 
      `<p>To complete the begy.nnel.se registration <a href="${url}">click here</a> to verify your email address</p>`
    )
  }

  router.post('/blimed', async (req, res) => {
    const { usr, pw } = req.body
    const user = getUserByEmail(usr)
    await slowResponse()
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
      await slowResponse()
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    if (await !checkPassword(pw, user.password)) {
      log(`Feil passord for bruker (${usr})`)
      await slowResponse()
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
      if (Date.now() - parseInt(digits, 10) > config.EMAIL_VERIFICATION_TIMEOUT) {
        log(`For lang tid siden registrering (${email})`)
        return res.status(400).json({ error: 'Too much time passed' })
      }
      setUserDetails(email, `et:CONFIRMED-${Date.now()};`)
      return res.json({ message: 'Verified!', success: true })
    }
    log(`Feil hemmelighet for bruker (${email})`)
    await slowResponse()
    return res.status(400).json({ error: 'Not valid token' })
  })

  router.post('/heisann', async (req, res) => {
    const { usr, pw } = req.body
    const user = getUserByEmail(usr)
    if (!user || !user.password) {
      log(`Fant ingen bruker (${usr})`)
      await slowResponse()
      return res.status(404).json({ error: 'Not found' })
    }
    if (await checkPassword(pw, user.password)) {
      if (!user.details.startsWith('et:CONFIRMED-')) {
        log(`Bruker mangler verifisering (${usr})`)
        await slowResponse()
        return res.status(403).json({ error: 'Email not verified' })
      }
      const token = makeTheToken(user.id, user.email)
      return res.json({ token, email: user.email, name: user.name })
    }
    log(`Feil usr/pw (${usr})`)
    await slowResponse()
    return res.status(401).json({ error: 'Invalid credentials' })
  })

  router.post('/slettmeg', authTheToken, async (req, res) => {
    // TODO: Mark users as 'deleted' in stead of actually removing
    const result = removeUser(req.user.id)
    await slowResponse()
    log(`Bruker slettet (${result.id, result.email})`)
    res.json({ message: `Slettet ${result.email}`, success: true })
  })

  router.get('/meg', authTheToken, async (req, res) => {
    const me = getUserById(req.user.id)
    if (!me)
      await slowResponse()
    res.json({
      name: me?.name || '',
      email: me?.email || '',
    })
  })

}
