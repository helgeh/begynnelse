import { authTheToken } from '../sikkerhet.js'
import { addCategory, getCategories, getCategory, updateCategory } from '../db.js'
import { log } from '../logger.js'
import { slowResponse } from '../utils.js'

export default function configure(router) {

  router.get('/kategorier', authTheToken, (req, res) => {
    const categories = getCategories(req.user.id)
    res.json(categories)
  })

  router.post('/kategorier', authTheToken, (req, res) => {
    const { name, title } = req.body
    try {
      const result = addCategory(name, title, req.user.id)
      res.json({ success: true, categoryId: result.lastInsertRowid })
    }
    catch (err) {
      res.status(500).json({ error: 'noe gikk feil' })
    }
  })

  router.put('/kategorier/:id', authTheToken, async (req, res) => {
    const category = getCategory(req.params.id)
    if (!category || category.user !== req.user.id) {
      log('Oppdatere kategori du ikke eier? Nei takk', req.user, req.body)
      await slowResponse()
      return res.status(401).json({ error: 'Not allowed' })
    }
    try {
      Object.keys(category).forEach(key => {
        if (key === 'id' || key === 'user')
          return
        category[key] = req.body[key]
      })
      const result = updateCategory(category)
      res.json({ success: true })
    }
    catch (err) {
      log('Noe gikk feil under oppdatering av kategori', err)
      await slowResponse()
      res.status(500).json({ error: 'Huh? Update failed' })
    }
  })

}
