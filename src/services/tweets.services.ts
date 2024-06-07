import { getTweetChildrenController } from './../controllers/tweets.controllers'
import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import databaseService from './database.services'
import Tweet from '~/models/schemas/Tweet.Schema'
import { ObjectId } from 'mongodb'
import Hashtag from '~/models/schemas/Hashtag.schema'
import { TweetType } from '~/constants/enums'

class tweetService {
  async createTweets({ user_id, body }: { user_id: string; body: TweetRequestBody }) {
    const hashtags = await this.checkAndCreateHashtag(body.hashtags)
    //lưu vào database
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: hashtags as ObjectId[],
        mentions: body.mentions,
        parent_id: body.parent_id,
        medias: body.medias,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )
    //return : kết quả là object có 2 thuộc tính {acknowledged : true, insertedId : <id>}
    //lấy id của tweet vừa tạo
    const tweet = await databaseService.tweets.findOne({
      _id: new ObjectId(result.insertedId)
    })
    return tweet
  }

  async getTweetById(id: string) {
    const [result] = await databaseService.tweets
      .aggregate<Tweet>([
        {
          $match: {
            parent_id: new ObjectId('660be1a041824a74d9da2433'),
            type: 2
          }
        },
        {
          $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
          }
        },
        {
          $addFields: {
            mentions: {
              $map: {
                input: '$mentions',
                as: 'mentions',
                in: {
                  _id: '$$mentions._id',
                  name: '$$mentions.name',
                  username: '$$mentions.username',
                  email: '$$mentions.email'
                }
              }
            }
          }
        },
        {
          $skip: 5
        },
        {
          $limit: 2
        }
      ])
      .toArray()
    return result
  }

  async checkAndCreateHashtag(hashtags: string[]) {
    //findOneAndUpdate giúp ta tìm kiếm và update 1 document ,nếu không có thì sẽ tạo mới,
    //findOneAndUpdate return về id của document đó
    //ta sẽ dùng map để biến đổi các hashtag(string) thành các id của các hashtag tìm đc hoặc tạo mới
    //findOneAndUpdate là promise nên map sẽ trả về 1 mảng các promise, ta sẽ dùng Promise.all để chờ tất cả các promise
    const hashtagDocument = await Promise.all(
      hashtags.map((hashtag) => {
        return databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          { $setOnInsert: new Hashtag({ name: hashtag }) }, //lệnh này là nếu không tìm thấy thì sẽ tạo mới
          { upsert: true, returnDocument: 'after' } //nếu ko tìm thấy sẽ tạo mới theo cái setOnInsert
          //và MongoDB sẽ trả về tài liệu đã được cập nhật sau khi thực hiện hoàn tất thao tác cập nhật
        )
      })
    )
    // hashtagDocument là mảng các ovject kết quả của findOneAndUpdate từ việc tìm và thêm hashtag
    return hashtagDocument.map((item) => item?._id)
  }

  async increaseView(tweet_id: string, user_id?: string) {
    const increase = user_id ? { user_views: 1 } : { guest_views: 1 }
    const result = await databaseService.tweets.findOneAndUpdate(
      {
        _id: new ObjectId(tweet_id)
      },
      {
        $inc: increase,
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: {
          guest_views: 1,
          user_views: 1,
          update_at: 1
        }
      }
    )
    return result
  }

  async getTweetChildren({
    tweet_id,
    limit,
    page,
    tweet_type,
    user_id //thêm cái này để tý mình tăng view
  }: {
    tweet_id: string
    limit: number
    page: number
    tweet_type: TweetType
    user_id?: string
  }) {
    const tweet = await databaseService.tweets
      .aggregate<Tweet>([
        {
          $match: {
            parent_id: new ObjectId('660be1a041824a74d9da2433'),
            type: 2
          }
        },
        {
          $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
          }
        },
        {
          $addFields: {
            mentions: {
              $map: {
                input: '$mentions',
                as: 'mentions',
                in: {
                  _id: '$$mentions._id',
                  name: '$$mentions.name',
                  username: '$$mentions.username',
                  email: '$$mentions.email'
                }
              }
            }
          }
        },
        {
          $skip: 5
        },
        {
          $limit: 2
        }
      ])
      .toArray()

    const total = await databaseService.tweets.countDocuments({
      parent_id: new ObjectId(tweet_id),
      type: tweet_type
    })
    return { tweet, total }
  }
}

const tweetsService = new tweetService()
export default tweetsService
