import { CustomSocket, io } from '@/app'
import { Game, Player } from '@/models/game.model'

import { User } from '@/models/user.model'

interface joinRoom {
  gamecode: string
  userinfo: { id: string; name: string }
}

export default (socket: CustomSocket) => {
  socket.on('joinRoom', async (joinRoomInfo: joinRoom) => {
    let game
    let { userinfo, gamecode } = joinRoomInfo
    const { id, name } = userinfo
    gamecode = gamecode.trim()
    try {
      game = await Game.findOne({ code: gamecode })

      if (!game) {
        throw new Error(`Game doesn't exist`)
      }

      const userAlreadyJoined = game.players.find((value) => value.player.id === id)
      if (userAlreadyJoined) {
        throw new Error(`You've already joined the Game`)
      }

      if (game.players.length >= 26) {
        throw new Error(`Game is full, only 25 people can join a game`)
      }

      const player: Player = {
        player: {
          id,
          name,
        },
        votes: [],
        voted: false,
      }

      game.players.push(player)
      await game.save()
      socket.join(gamecode)
      socket.userId = id

      const gameId = game._id
      const gameEmitInfo = {
        started: game.started,
        rules: game.rules,
        name: game.name,
        admin: game.admin,
        expires: game.expires,
        players: game.players,
        code: game.code,
        id: gameId,
      }

      await User.findOneAndUpdate({ uid: id }, { gamePlaying: gameId })

      socket.emit('joinedRoom', gameEmitInfo)
      socket.in(gamecode).emit('newPlayer', {
        gameEmitInfo,
        userId: id,
      })
    } catch (error) {
      console.error(error)
      socket.emit('joinRoomError', error.message)
    }
  })
}
