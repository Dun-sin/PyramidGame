import { Game } from '@/models/game.model'
import { ObjectId } from 'mongoose'
import { User } from '@/models/user.model'
import { io } from '@/app'

interface Result {
  A: { id: string; name: string; vote: number }[]
  B: { id: string; name: string; vote: number }[]
  C: { id: string; name: string; vote: number }[]
  D: { id: string; name: string; vote: number }[]
  F: { id: string; name: string; vote: number }[]
}

type ResultEnum = 'A' | 'B' | 'C' | 'D' | 'F'

export const deleteGame = async ({ gameId, gameCode }: { gameId: ObjectId; gameCode: string }, result: Result) => {
  !allGradesEmpty(result) &&
    (await User.updateMany(
      { gamePlaying: gameId },
      {
        $set: { lastGameResult: result },
        $unset: { gamePlaying: 1 },
      },
    ))

  await User.updateMany(
    { gamePlaying: gameId },
    {
      $unset: { gamePlaying: 1 },
    },
  )

  await User.updateOne({ adminOfGame: gameId }, { $unset: { adminOfGame: 1 } })

  await Game.findByIdAndDelete(gameId)
  io.in(gameCode).emit('gameExpired')
}

export function calculateGrade(totalPeople: number, vote: number): ResultEnum {
  const step = Math.ceil(totalPeople / 4)
  const gradeThresholds = [1, Math.ceil(step * 1), Math.ceil(step * 2), Math.ceil(step * 3)]

  if (vote >= gradeThresholds[3]) {
    return 'A'
  } else if (vote >= gradeThresholds[2]) {
    return 'B'
  } else if (vote >= gradeThresholds[1]) {
    return 'C'
  } else if (vote >= gradeThresholds[0]) {
    return 'D'
  } else {
    return 'F'
  }
}

export async function calculatingResult(gameId: ObjectId) {
  const game = await Game.findById(gameId)

  const allVotes: string[][] = []

  game.players.forEach((value) => {
    if (value.votes.length === 5) {
      allVotes.push(value.votes)
    }
  })
  const idCounts: Record<string, number> = {}
  allVotes.forEach((votes) => {
    votes.forEach((id) => {
      idCounts[id] = (idCounts[id] || 0) + 1
    })
  })

  const totalPeople = game.players.length
  const allIdsVotedFor = Object.keys(idCounts)
  const allPlayersId = game.players.map((value) => value.player.id)
  allIdsVotedFor.forEach((value) => {
    const vote = idCounts[value]
    const grade: 'A' | 'B' | 'C' | 'D' | 'F' = calculateGrade(totalPeople, vote)
    const name = game.players.find((item) => item.player.id === value).player.name

    game.result[grade] = [...game.result[grade], { id: value, name, vote }]
  })

  const playerNotVotedFor: string[] = []

  allPlayersId.forEach((value) => {
    if (allIdsVotedFor.includes(value)) return

    playerNotVotedFor.push(value)
  })

  playerNotVotedFor.forEach((player) => {
    const grade = 'F'
    const name = game.players.find((item) => item.player.id === player).player.name
    game.result[grade] = [...game.result[grade], { id: player, name, vote: 0 }]
  })

  game.save()
}

export const allGradesEmpty = (result: Result): boolean => {
  let values = Object.values(result)
  if (values.length > 5) values.shift()

  return values.every((value) => value.length === 0)
}
