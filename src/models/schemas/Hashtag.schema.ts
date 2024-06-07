import { ObjectId } from 'mongodb'

interface HashtagType {
  _id?: ObjectId
  name: string
  create_at?: Date
}

export default class Hashtag {
  _id?: ObjectId
  name: string
  create_at?: Date

  constructor(hashtag: HashtagType) {
    this._id = hashtag._id || new ObjectId()
    this.name = hashtag.name
    this.create_at = hashtag.create_at || new Date()
  }
}
