import { CustomSocket } from '@/app'
import { Game } from '@/models/game.model'
import { User } from '@/models/user.model'
import { deleteGame } from '@/utils/lib'

export interface gameInfo {
  name: string
  rules: [string]
  admin: { id: string; name: string }
  code: string
  players: [
    {
      player: { id: string; name: string }
      votes: [string]
      voted: boolean
    },
  ]
}

export default (socket: CustomSocket) => {
  socket.on('createGame', async (gameInfo: gameInfo) => {
    socket.join(gameInfo.code.trim())
    socket.userId = gameInfo.admin.id

    let game
    try {
      const currentTime = new Date()
      const futureTime = new Date(currentTime.getTime() + 30 * 60000)

      game = await Game.create({
        name: gameInfo.name,
        rules: gameInfo.rules,
        admin: gameInfo.admin,
        expires: futureTime,
        code: gameInfo.code,
        players: gameInfo.players,
      })
      const gameId = game._id
      await User.findOneAndUpdate({ uid: gameInfo.admin.id }, { gamePlaying: gameId, adminOfGame: gameId })

      const timeUntilExpiration = new Date(game.expires).getTime() - new Date().getTime()

      setTimeout(deleteGame, timeUntilExpiration)
    } catch (error) {
      console.log(error)
    }

    console.log(`${gameInfo.admin} created room: ${gameInfo.code}`)

    socket.emit('createdGame', {
      started: game.started,
      rules: game.rules,
      name: game.name,
      admin: game.admin,
      expires: game.expires,
      players: game.players,
      code: game.code,
      id: game._id,
    })
  })
}
// TODO: remember to clear all game stats from user db e.g gamePlaying, adminOfGame
