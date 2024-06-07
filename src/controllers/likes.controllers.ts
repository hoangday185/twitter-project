import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKES_MESSAGES } from '~/constants/message'
import { LikeTweetReqBody } from '~/models/requests/Like.request'
import { TokenPayload } from '~/models/requests/User.requests'
import likesService from '~/services/likes.services'

export const likeTweetController = async (
  req: Request<ParamsDictionary, any, LikeTweetReqBody>,
  res: Response
) => {
  const { tweet_id } = req.body as LikeTweetReqBody
  const { user_id } = req.decoded_authorization as TokenPayload
  const like = await likesService.likeTweet(user_id, tweet_id)
  res.json({
    message: LIKES_MESSAGES.LIKE_SUCCESS,
    data: like
  })
}

export const unlikeTweetController = async (req: Request, res: Response) => {
  const { tweet_id } = req.params
  const { user_id } = req.decoded_authorization as TokenPayload
  await likesService.unlikeTweet(user_id, tweet_id)
  res.json({
    message: LIKES_MESSAGES.UNLIKE_SUCCESS
  })
}
