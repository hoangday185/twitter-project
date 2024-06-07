import { Router } from 'express'
import {
  serveImageController,
  serveVideoStreamController
} from '~/controllers/medias.controllers'

const staticRouter = Router()

staticRouter.get('/image/:filename', serveImageController)

staticRouter.get('/video-stream/:filename', serveVideoStreamController)

export default staticRouter
