import { IS_PRODUCTION } from '@/config/config'
import express from 'express'
import games from './game.route'
import swaggerUi from 'swagger-ui-express'
import user from './user.route'

// auto-gen, or use "yarn swagger"
// import swaggerOutput from '../swagger_output.json'

const router = express.Router()

router.use('/games', games)
router.use('/users', user)

if (!IS_PRODUCTION) {
  // router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput))
}

export default router
