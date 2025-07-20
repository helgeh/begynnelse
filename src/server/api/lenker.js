import { authTheToken } from '../sikkerhet.js'
import { addLink, getLinks } from '../db.js'

export default function configure(router) {

  router.get('/lenker', authTheToken, (req, res) => {
    const links = getLinks(req.user.id)
    // setTimeout(() => {
      res.json(links)
    // }, 5000)
  })

  router.post('/lenker', authTheToken, (req, res) => {
    const { url, title, category, tags } = req.body
    const result = addLink(title, url, req.user.id)
    res.json({ success: true })
  })

  // router.post('/lenker/:id', authTheToken, (req, res) => {
  //   const { url, title, category, tags } = req.body
  //   const result = updateLink({title, url, category, tags}, req.user.id)
  //   res.json({ success: true })
  // })

}
