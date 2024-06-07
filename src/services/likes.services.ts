import { ObjectId, WithId } from 'mongodb'
import databaseService from './database.services'
import Like from '~/models/schemas/Like.schema'

class LikeService {
  async likeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.likes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Like({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result
  }

  async unlikeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.likes.deleteOne({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
}

const likesService = new LikeService()
export default likesService
