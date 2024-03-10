import { Document, Schema, model } from 'mongoose'

export interface IGame {
  name: string
  rules: string[]
  admin: string
  players: string[]
  result: Record<string, { grade: string; players: string[] }>
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
    admin: { type: String, ref: 'User', required: true, unique: true },
    players: [{ type: String, ref: 'User' }],
    result: {
      type: Map,
      of: {
        grade: { type: String, enum: ['A', 'B', 'C', 'D', 'E', 'F'] },
        players: [{ type: String, ref: 'User' }],
      },
    },
    expires: { type: Date, required: true },
    started: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export const Game = model<IGameModel>('Game', schema)
