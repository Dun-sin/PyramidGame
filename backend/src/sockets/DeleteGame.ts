import { allGradesEmpty, calculatingResult, deleteGame } from '@/utils/lib'

import { CustomSocket } from '@/app'
import { Game } from '@/models/game.model'

export default (socket: CustomSocket) => {
  socket.on('deleteGame', async ({ gameId, gameCode }) => {
    const game = await Game.findById(gameId)
    if (!game) return

    let numberOfVotes: number = 0
    game.players.forEach((value) => {
      if (value.voted) {
        numberOfVotes += 1
      }
    })

    if (numberOfVotes >= 3 && allGradesEmpty(game.result)) {
      calculatingResult(gameId)
    }

    deleteGame({ gameId, gameCode }, game.result)
  })
}
