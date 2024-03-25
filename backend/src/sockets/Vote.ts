import { calculatingResult, deleteGame } from '@/utils/lib'

import { CustomSocket } from '@/app'
import { Game } from '@/models/game.model'

interface Vote {
  vote: string[]
  gameId: string
  userId: string
}
export default (socket: CustomSocket) => {
  socket.on('vote', async ({ vote, gameId, userId }: Vote) => {
    try {
      const game = await Game.findById(gameId)
      const hasPlayerVoted = game.players.find((value) => value.player.id === userId).voted

      if (hasPlayerVoted) {
        return socket.emit(`errorVoting`, `You've already voted`)
      }

      if (vote.includes(userId)) {
        return socket.emit(`errorVoting`, `You can't vote for yourself`)
      }

      const playerIndex = game.players.findIndex((player) => player.player.id === userId)

      // Update the player's votes and voted status
      game.players[playerIndex].votes = vote
      game.players[playerIndex].voted = true

      game.save()
      const gameInfo = {
        started: game.started,
        rules: game.rules,
        name: game.name,
        admin: game.admin,
        expires: game.expires,
        players: game.players,
        code: game.code,
        id: game._id,
      }

      socket.emit(`successfullyVoted`, gameInfo)
      socket.in(game.code).emit('someoneVoted', {
        gameInfo,
        message: `${game.players[playerIndex].player.name} just Voted!`,
      })

      const allPlayersHaveVoted = game.players.every((player) => player.voted)
      if (allPlayersHaveVoted) {
        const gameId = game._id
        calculatingResult(gameId)
        socket.in(game.code).emit('everyoneHasVoted')

        setTimeout(() => {
          deleteGame({ gameId, gameCode: game.code }, game.result)
        }, 1000)
      }
    } catch (error) {
      console.log(error)
      socket.emit(`errorVoting`, `Oops something went wrong`)
    }
  })
}
