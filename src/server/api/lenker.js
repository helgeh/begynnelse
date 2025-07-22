import { authTheToken } from '../sikkerhet.js'
import { addLink, updateLink, deleteLink, getLinks, getLink } from '../db.js'
import { log } from '../logger.js'
import { slowResponse } from '../utils.js'

export default function configure(router) {

  router.get('/lenker', authTheToken, (req, res) => {
    const links = getLinks(req.user.id)
    res.json(links)
  })

  router.post('/lenker', authTheToken, (req, res) => {
    const { name, url, category, tags } = req.body
    // TODO: also add category, tags and icon if provided
    const result = addLink(name, url, req.user.id)
    res.json({ success: true, linkId: result.lastInsertRowid })
  })

  router.put('/lenker/:id', authTheToken, async (req, res) => {
    const link = getLink(req.params.id)
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

  router.delete('/lenker/:id', authTheToken, async (req, res) => {
    const link = getLink(req.params.id)
    if (!link || link.user !== req.user.id) {
      log('Slette link du ikke eier? Nei takk', req.user, req.body)
      await slowResponse()
      return res.status(401).json({ error: 'Not allowed' })
    }
    try {
      const result = deleteLink(link.id)
      res.json({ success: true })
    }
    catch (err) {
      log('Noe gikk feil under sletting av link', err)
      await slowResponse()
      res.status(500).json({ error: 'Huh? Remove failed' })
    }
  })

}
