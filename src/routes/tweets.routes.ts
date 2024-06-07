import { Router } from 'express'
import {
  createTweetController,
  getTweetChildrenController,
  getTweetController
} from '~/controllers/tweets.controllers'
import {
  createTweetValidator,
  getTweetChildrenValidator,
  tweetIdValidator
} from '~/middlewares/tweets.middlewares'
import {
  accessTokenValidator,
  audienceValidator,
  isUserLoggedInValidator,
  verifiedUserValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const tweetsRouter = Router()
//làm route tạo tweet
/*
des : làm route tạo tweet 
method : POST
headers : {Authorzation : Bearer <access_token>}
phải verify account thì mới tạo được tweet 
body : TweetRequestBody
*/
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapAsync(createTweetController)
)
export default tweetsRouter

/**
 * des : get detail tweet
 * path : /:id
 * headers : {
 * Authorization : Bearer <access_token>
 * }
 * method : get
 */

tweetsRouter.get(
  '/:tweet_id',
  tweetIdValidator, //hàm này để check id tweet có tồn tại ko
  isUserLoggedInValidator(accessTokenValidator), //đã đăng nhập chưa này nếu chưa thì chỉ xem đc các tweet everyone
  isUserLoggedInValidator(verifiedUserValidator), //phải xem nó có verify chưa
  wrapAsync(audienceValidator), //kiểm tra đối tượng được xem tweet này
  wrapAsync(getTweetController)
)

/**
 * des : get tweet children
 * path : /:tweet_id/children
 * headers : {
 *  Authorization : Bearer <access_token>
 * params : tweet_id
 *
 * }
 */

tweetsRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  getTweetChildrenValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  wrapAsync(audienceValidator),
  wrapAsync(getTweetChildrenController)
)
