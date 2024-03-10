import ApiError from '@/utils/ApiError'
import { Game } from '@/models/game.model'
import { Types } from 'mongoose'
import express from 'express'
import httpStatus from 'http-status'

const router = express.Router()

router.get('/:id', async (req, res, next) => {
  try {
    const gameId = Types.ObjectId(req.params.id)
    const game = await Game.findById(gameId)
    if (!game) throw new ApiError(httpStatus.NOT_FOUND, 'Game not found')
    res.json(game)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const game = new Game(req.body)
    await game.save()
    res.json(game)
  } catch (e) {
    next(e)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const game = await Game.findOne({ _id: req.params.id })
    const admin = req.body.admin

    if (!game) throw new ApiError(httpStatus.NOT_FOUND, 'Game not found')

    if (!admin) {
      throw new ApiError(httpStatus.UNAUTHORIZED, `Not authorized to perform this action`)
    }

    if (game.admin !== admin) {
      throw new ApiError(httpStatus.UNAUTHORIZED, `Not authorized to perform this action`)
    }

    const { players, result, started } = req.body.game
    if (players) {
      game.players = players
    }

    if (result) {
      game.result = result
    }
    if (started) {
      game.started = started
    }

    await game.save()
    res.json(game)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const game = await Game.findOne({ _id: req.params.id })
    const admin = req.body.admin

    if (!game) throw new ApiError(httpStatus.NOT_FOUND, 'Game not found')

    if (!admin) {
      throw new ApiError(httpStatus.UNAUTHORIZED, `Not authorized to perform this action`)
    }

    if (game.admin !== admin) {
      throw new ApiError(httpStatus.UNAUTHORIZED, `Not authorized to perform this action`)
    }

    await game.delete()
    res.status(httpStatus.NO_CONTENT).send()
  } catch (e) {
    next(e)
  }
})

export default router
