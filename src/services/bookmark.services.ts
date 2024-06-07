import { ObjectId, WithId } from 'mongodb'
import databaseService from './database.services'
import Bookmark from '~/models/schemas/Bookmark.schema'

class BookmarkService {
  async checkAndCreateBookmarkTweet(user_id: string, tweet_id: string) {
    //chơi như thằng hashtag
    const result = await databaseService.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({
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

  async unBookmarkTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.bookmarks.deleteOne({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
