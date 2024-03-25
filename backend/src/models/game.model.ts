import { Document, Schema, model } from 'mongoose'

export interface Player {
  player: { id: string; name: string }
  votes: string[]
  voted: boolean
}
export interface IGame {
  name: string
  rules: string[]
  admin: { id: string; name: string }
  players: Player[]
  result: {
    A: { id: string; name: string; vote: number }[]
    B: { id: string; name: string; vote: number }[]
    C: { id: string; name: string; vote: number }[]
    D: { id: string; name: string; vote: number }[]
    F: { id: string; name: string; vote: number }[]
  }
  expires: Date
  started: boolean
  code: string
}

export default interface IGameModel extends Document, IGame {}

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    rules: {
      type: [String],
      required: true,
    },
    admin: {
      id: { type: String, ref: 'User', unique: true, required: true },
      name: { type: String, required: true },
    },
    players: [
      {
        player: {
          id: { type: String, ref: 'User', unique: true, required: true },
          name: { type: String, unique: true, required: true },
        },
        votes: [{ type: String, ref: 'User' }],
        voted: { type: Boolean, default: false },
      },
    ],
    result: {
      A: [{ id: { type: String, ref: 'User' }, name: String, vote: Number }],
      B: [{ id: { type: String, ref: 'User' }, name: String, vote: Number }],
      C: [{ id: { type: String, ref: 'User' }, name: String, vote: Number }],
      D: [{ id: { type: String, ref: 'User' }, name: String, vote: Number }],
      F: [{ id: { type: String, ref: 'User' }, name: String, vote: Number }],
    },
    expires: { type: Date, required: true },
    started: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export const Game = model<IGameModel>('Game', schema)
