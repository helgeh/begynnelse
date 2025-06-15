
import path from 'path'
import express from 'express'
import cors from 'cors'
import ViteExpress from 'vite-express'

import api from './api.js'

const port = process.env.PORT || 3001
const publicPath = path.join(path.resolve(), 'public')
const app = express()

app.use(cors())
app.use(api)
app.use('/', express.static(publicPath))
app.use((err, req, res, next) => {
    if (req.xhr)
        res.status(500).send({error: 'Something feila'})
    else
        next(err)
})

ViteExpress.config({ inlineViteConfig: 'vite.config.js' })

ViteExpress.listen(app, port, () =>
    console.log(`Server is listening on port ${port}...`)
)
