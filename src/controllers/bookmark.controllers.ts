import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { BookmarkTweetReqBody } from '~/models/requests/Bookmark.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import { BOOKMARK_MESSAGE } from '~/constants/message'
import bookmarkService from '~/services/bookmark.services'

export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: Response
) => {
  const { tweet_id } = req.body
  const { user_id } = req.decoded_authorization as TokenPayload
  const bookmark = await bookmarkService.checkAndCreateBookmarkTweet(
    user_id.toString(),
    tweet_id
  )
  res.json({
    message: BOOKMARK_MESSAGE.BOORMARK_SUCCESS,
    bookmark
  })
}

export const unbookmarkTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweetId } = req.params
  await bookmarkService.unBookmarkTweet(user_id.toString(), tweetId)
  res.json({
    message: BOOKMARK_MESSAGE.UNBOOKMARK_SUCCESS
  })
}
