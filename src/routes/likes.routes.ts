import { Router } from 'express'
import { wrap } from 'module'
import {
  likeTweetController,
  unlikeTweetController
} from '~/controllers/likes.controllers'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
import {
  accessTokenValidator,
  verifiedUserValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const likesRouter = Router()

/**
 * des : like a tweet
 * path:/
 * method : post
 * header: {Authorization Bearer <access_token>}
 * body : {tweet_id}
 */

likesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapAsync(likeTweetController)
)

/**
 * des : unlike a tweet
 * path : /tweet_id
 * method : delete
 * header : { Authorization Bearer <access_token>}
 * params : {tweet_id}
 */
likesRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapAsync(unlikeTweetController)
)
export default likesRouter
