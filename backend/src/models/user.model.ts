import { Document, Schema, model, models } from 'mongoose'

import uniqueValidator from 'mongoose-unique-validator'

export interface IUser {
  username: string
  uid: string
}

export default interface IUserModel extends Document, IUser {}

const schema = new Schema<IUserModel>(
  {
    username: {
      type: String,
      minlength: 3,
    },
    uid: {
      type: String,
      unique: true,
      minLength: 10,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Plugins
schema.plugin(uniqueValidator)

export const User = models.User || model<IUserModel>('User', schema)
