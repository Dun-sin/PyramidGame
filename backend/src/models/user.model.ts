import { Document, ObjectId, Schema, model, models } from 'mongoose'

import uniqueValidator from 'mongoose-unique-validator'

export interface IUser {
  name: string
  uid: string
  gamePlaying: ObjectId
  adminOfGame: ObjectId
  lastGameResult: {
    A: { id: string; name: string; vote: number }[]
    B: { id: string; name: string; vote: number }[]
    C: { id: string; name: string; vote: number }[]
    D: { id: string; name: string; vote: number }[]
    F: { id: string; name: string; vote: number }[]
  }
}

export default interface IUserModel extends Document, IUser {}

const schema = new Schema<IUserModel>(
  {
    name: {
      type: String,
      minlength: 5,
    },
    uid: {
      type: String,
      unique: true,
      minLength: 10,
      required: true,
    },
    gamePlaying: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
    },
    lastGameResult: {
      A: [{ id: { type: String, ref: 'User' }, name: String, vote: Number }],
      B: [{ id: { type: String, ref: 'User' }, name: String, vote: Number }],
      C: [{ id: { type: String, ref: 'User' }, name: String, vote: Number }],
      D: [{ id: { type: String, ref: 'User' }, name: String, vote: Number }],
      F: [{ id: { type: String, ref: 'User' }, name: String, vote: Number }],
    },
    adminOfGame: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
)

// Plugins
schema.plugin(uniqueValidator)

schema.pre('save', async function (next) {
  if (this.isModified('gamePlaying') && this.gamePlaying) {
    await this.populate('gamePlaying').execPopulate()
  }

  next()
})

export const User = models.User || model<IUserModel>('User', schema)
