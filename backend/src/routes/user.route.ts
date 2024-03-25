import ApiError from '@/utils/ApiError'
import { User } from '@/models/user.model'
import express from 'express'
import httpStatus from 'http-status'
import logger from '@/config/logger'

const router = express.Router()

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({ uid: req.params.id }).populate('gamePlaying', '-updatedAt -createdAt -__v ')
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    res.status(httpStatus.OK).json(user)
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  const { uid } = req.body

  try {
    const existingUser = await User.findOne({ uid: uid })
    if (existingUser) {
      return res.status(httpStatus.OK).json(existingUser)
    }
    const user = new User({ uid })
    await user.save()
    res.status(httpStatus.OK).json(user)
  } catch (e) {
    next(e)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({ uid: req.params.id })
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    const { name } = req.body
    if (name) {
      user.name = name
    }

    await user.save()
    res.status(httpStatus.OK).json(user)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({ uid: req.params.id })
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    await user.delete()
    res.status(httpStatus.NO_CONTENT).send()
  } catch (e) {
    next(e)
  }
})

export default router
