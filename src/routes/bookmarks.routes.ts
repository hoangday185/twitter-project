import { Router } from 'express'
import {
  bookmarkTweetController,
  unbookmarkTweetController
} from '~/controllers/bookmark.controllers'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
import {
  accessTokenValidator,
  verifiedUserValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const bookmarksRouter = Router()
/**
 * des : bookmark a tweet
 * path : /bookmarks
 * headers : {Authorization : Bearer <access_token> }
 * method : post
 * body : { tweet_id : string }
 */

bookmarksRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapAsync(bookmarkTweetController)
) //bookmarkTweetController chưa làm

/**
 * des : get all bookmarks
 * path : /tweets/
 * headers : {Authorization : Bearer <access_token> }
 * method : delete
 * params : { tweetId : string }
 */
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapAsync(unbookmarkTweetController)
)
export default bookmarksRouter
