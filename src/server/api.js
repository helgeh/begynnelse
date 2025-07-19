import express from 'express'
import { default as configureUsers } from './api/users.js'
import { default as configureLenker } from './api/lenker.js'
import { default as configurePodcasts } from './api/podcasts.js'
import { default as configureDiverse } from './api/diverse.js'

const router = express.Router()

router.use(express.json())

configureUsers(router)
configureLenker(router)
configurePodcasts(router)
configureDiverse(router)

export default router
