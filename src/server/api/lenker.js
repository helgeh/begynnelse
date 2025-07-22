import { authTheToken } from '../sikkerhet.js'
import { addLink, updateLink, getLinks, getLink } from '../db.js'
import { log } from '../logger.js'
import { slowResponse } from '../utils.js'

export default function configure(router) {

  router.get('/lenker', authTheToken, (req, res) => {
    const links = getLinks(req.user.id)
    // setTimeout(() => {
      res.json(links)
    // }, 5000)
  })

  router.post('/lenker', authTheToken, (req, res) => {
    const { name, url, category, tags } = req.body
    // TODO: also add category, tags and icon if provided
    const result = addLink(name, url, req.user.id)
    console.log('add lenke result', result)
    res.json({ success: true, linkId: result.lastInsertRowid })
  })

  router.put('/lenker/:id', authTheToken, async (req, res) => {
    const link = getLink(req.params.id)
    console.dir(req.body)
    // console.dir(req.user)
    if (!link || link.user !== req.user.id) {
      log('Oppdatere link du ikke eier? Nei takk', req.user, req.body)
      await slowResponse()
      return res.status(401).json({ error: 'Not allowed' })
    }
    try {
      Object.keys(link).forEach(key => {
        if (key === 'id' || key === 'user')
          return
        link[key] = req.body[key]
        console.log('update ' + key, req.body[key])
      })
      const result = updateLink(link)
      res.json({ success: true })
    }
    catch (err) {
      log('Noe gikk feil under oppdatering av link', err)
      await slowResponse()
      res.status(500).json({ error: 'Huh? Update failed' })
    }
  })

  // router.post('/lenker/:id', authTheToken, (req, res) => {
  //   const { url, title, category, tags } = req.body
  //   const result = updateLink({title, url, category, tags}, req.user.id)
  //   res.json({ success: true })
  // })

}
