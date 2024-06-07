import { config } from 'dotenv'
import fs from 'fs'
import argv from 'minimist'
import path from 'path'
// const options = argv(process.argv.slice(2))
//đoạn code trên đem từ index qua ,xóa bên index và xóa log của option luôn

const env = process.env.NODE_ENV
console.log(env)
const envFileName = `.env.${env}`

if (!env) {
  console.log(`Bạn chưa cung cấp biến môi trường cho file NODE_ENV`)
  console.log(`Hiện tại NODE_ENV=${env}`)
  process.exit(1)
}
console.log(
  `Phát hiện NODE_ENV=${env}, vì thế app sẽ dùng file môi trường là ${envFileName}`
)

if (!fs.existsSync(path.resolve(envFileName))) {
  console.log(`Không tìm thấy file môi trường ${envFileName}`)
  console.log(
    `Lưu ý app không dùng file .env, ví dụ môi trường development thì app sẽ dùng file .env.development`
  )
  process.exit(1)
}

export const isProduction = env == 'production'
config({
  path: envFileName
})

export const envConfig = {
  dbUserName: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
  dbUsersCollection: process.env.DB_USERS_COLLECTION as string,
  dbRefreshTokensCollection: process.env.DB_REFRESH_TOKENS_COLLECTION as string,
  passwordSercet: process.env.PASSWORD_SECRET as string,
  accessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  refreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  sercetEmailToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  forgotPasswordToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
  accessTokenExpireIn: process.env.ACCESS_TOKEN_EXPIRE_IN as string,
  refreshTokenExpireIn: process.env.REFESH_TOKEN_EXPIRE_IN as string,
  emailTokenExpireIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN as string,
  forgotPasswordTokenExpireIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRE_IN as string,
  dbFollowersCollection: process.env.DB_FOLLOWERS_COLLECTION as string,
  dbTweetsCollection: process.env.DB_TWEETS_COLLECTION as string,
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI as string,
  clientRedirectCallback: process.env.CLIENT_REDIRECT_CALLBACK as string,
  clientUri: process.env.CLIENT_URI as string,
  port: (process.env.PORT as string) || 4000,
  dbHashtagsCollection: process.env.DB_HASHTAGS_COLLECTION as string,
  dbBookmarksCollection: process.env.DB_BOOKMARKS_COLLECTION as string,
  dbLikesCollection: process.env.DB_LIKES_COLLECTION as string
}
