import express, { NextFunction, Request, Response } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import { MongoClient } from 'mongodb'
import tweetsRouter from './routes/tweets.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import { envConfig, isProduction } from '~/constants/config'
import helmet from 'helmet'
import cors, { CorsOptions } from 'cors'
import rateLimit from 'express-rate-limit'
config()
initFolder()

const app = express()

const corsOption: CorsOptions = {
  origin: isProduction ? envConfig.clientUri : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //window mili seconds 15p
  max: 100, //100 request trong 15p
  standardHeaders: true, //return rate limit info in the 'RateLimit-* ' headers
  legacyHeaders: true //Disable the 'X-RateLimit-*' headers
})

app.use(limiter)

app.use(helmet())
app.use(cors(corsOption))
app.use(express.json())
const PORT = envConfig.port

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexFollowers()
  databaseService.indexTweet()
})

app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/tweets', tweetsRouter)
// app.use(express.static(UPLOAD_IMAGE_DIR)) //static file handler
// app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
//nếu viết như vậy thì link dẫn sẽ là localhost:4000/blablabla.jpg
app.use('/static', staticRouter) //nếu muốn thêm tiền tố, ta sẽ làm thế này
//vậy thì nghĩa là vào localhost:4000/static/blablabla.jpg
// Path: src/users.routes.ts
// app.get('/', (req, res) => {
//   res.send('Hello World')
// })
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  // console.log(process.argv)
})

//chúng ta đang dùng mô hình mvc
//nhưng thực tế muốn từ view qua controller thì phải qua middleware
//cấu trúc của middleware như 1 củ hành tây, tại user phải đi qua từng lớp middleware
//hàm next() để thông báo rằng việc mọi thứ đã xong, có thể đi tiếp
//tức là nếu mình chỉ gọi tới localhost:3000/api thì nó vẫn chạy middleware nhưng ko chạy qua tweets
//nếu ko có next() thì sẽ bị treo ở đây
//đây chính là hiện tượng pending trong call api
//khi cài mongodb thì cần cài lại expressjs hoặc cài lại mấy file config

/**
 * script for package json if not use mininist
 *    "dev": "npx nodemon --env=development",
    "dev:production": "npx nodemon --env=production",
    "dev:staging": "npx nodemon --env=staging",
    "build": "rimraf ./dist && tsc && tsc-alias",
    "start:dev": "node dist/index.js --env=development",
    "start:staging": "node dist/index.js --env=staging",
    "start:production": "node dist/index.js --env=production",
 */
