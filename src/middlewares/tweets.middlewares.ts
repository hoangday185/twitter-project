import { getTweetChildrenController } from './../controllers/tweets.controllers'
import { Request } from 'express'
import { TWEETS_MESSAGES } from './../constants/message'
import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enums'
import tweetsService from '~/services/tweets.services'
import { numberEnumToArray } from '~/utils/common'
import { validate } from '~/utils/validation'
import Tweet from '~/models/schemas/Tweet.Schema'
import { ErrorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'

const tweetTypes = numberEnumToArray(TweetType)
const TweetAudiences = numberEnumToArray(TweetAudience)
const mediaTypes = numberEnumToArray(MediaType)

export const createTweetValidator = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [tweetTypes], //[[0,1,2,3]]
          errorMessage: TWEETS_MESSAGES.INVALID_TYPE
        }
      },
      audience: {
        isIn: {
          options: [TweetAudiences],
          errorMessage: TWEETS_MESSAGES.INVALID_AUDIENCE
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            //value là giá trị của type
            const type = req.body.type as TweetType
            if (type !== TweetType.Tweet && !ObjectId.isValid(value)) {
              throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
            }

            //nếu type là tweet thì parent_id phải là null
            if (type === TweetType.Tweet && value !== null) {
              throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_NULL)
            }

            return true
          }
        }
      },
      content: {
        isString: true,
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            const mentions = req.body.mentions as string[]
            const hashtags = req.body.hashtags as string[]
            //khi type là retweet thì content == '', mentions == [], hashtags == []
            if (
              type !== TweetType.Retweet &&
              isEmpty(hashtags) &&
              isEmpty(mentions) &&
              value.trim() === ''
            ) {
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
            }

            //nếu type là retweet thì content phải là ''
            if (type === TweetType.Retweet && value !== '') {
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_EMPTY_STRING)
            }

            return true
          }
        }
      },
      hashtags: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            //value là hashtags : string[]
            //nếu có thằng item nào ko phải string thì throw error
            if (value.some((item: any) => typeof item !== 'string')) {
              throw new Error(TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
            }
            return true
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            //value là hashtags : string[]
            //nếu có thằng item nào ko phải string thì throw error
            if (value.some((item: any) => !ObjectId.isValid(item))) {
              throw new Error(TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_user_id)
            }
            return true
          }
        }
      },
      medias: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (
              value.some((item: any) => {
                return item.url !== 'string' || !mediaTypes.includes(item.type)
              })
            ) {
              throw new Error(TWEETS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const tweetIdValidator = validate(
  checkSchema(
    {
      tweet_id: {
        notEmpty: true,
        custom: {
          options: async (value, { req }) => {
            //Check xem id hợp lẹ không
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: TWEETS_MESSAGES.INVAILD_TWEET_ID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            const isExist = await tweetsService.getTweetById(value)
            if (!isExist) {
              throw new ErrorWithStatus({
                message: TWEETS_MESSAGES.TWEET_IS_NOT_EXIST,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).tweet = isExist
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const getTweetChildrenValidator = validate(
  checkSchema(
    {
      tweet_type: {
        isIn: {
          options: [tweetTypes]
        }
      },
      limit: {
        isNumeric: true,
        custom: {
          options: (value, { req }) => {
            const num = Number(value)
            if (num > 100 || num < 1) {
              throw new Error(TWEETS_MESSAGES.LIMIT_MUST_BE_LESS_THAN_100)
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
