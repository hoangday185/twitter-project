import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { TweetParam, TweetRequestBody } from '~/models/requests/Tweet.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import { TWEETS_MESSAGES } from '~/constants/message'
import tweetsService from '~/services/tweets.services'
import Tweet from '~/models/schemas/Tweet.Schema'

export const createTweetController = async (
  req: Request<ParamsDictionary, any, TweetRequestBody>,
  res: Response
) => {
  //muốn đăng bài thì cần user_id và body
  const body = req.body as TweetRequestBody
  const { user_id } = req.decoded_authorization as TokenPayload
  //gọi hàm lưu vào database
  const result = await tweetsService.createTweets({ user_id, body })
  return res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESSFULLY,
    result
  })
}

export const getTweetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await tweetsService.increaseView(
    req.params.tweet_id,
    req.decoded_authorization?.user_id.toString()
  )
  const tweet = {
    ...req.tweet,
    ...result
  }
  res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESS,
    Tweet: tweet
  })
}

export const getTweetChildrenController = async (
  req: Request<TweetParam, any, any, TweetParam>,
  res: Response
) => {
  const { tweet_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const tweet_type = Number(req.query.tweet_type)
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet, total } = await tweetsService.getTweetChildren({
    tweet_id,
    user_id: user_id.toString(),
    limit,
    page,
    tweet_type
  })
  res.json({
    message: TWEETS_MESSAGES.GET_TWEET_CHILDREN_SUCCESS,
    results: {
      tweet,
      tweet_type,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}
