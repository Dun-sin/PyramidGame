import { APP_PREFIX_PATH, IS_TEST } from '@/config/config'
import { errorConverter, errorHandler } from './middlewares/error'

import ApiError from './utils/ApiError'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import httpStatus from 'http-status'
import mongoSanitize from 'express-mongo-sanitize'
import routes from '@/routes'
import swaggerUi from 'swagger-ui-express'

const app = express()

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// sanitize request data
// app.use(xss())
app.use(mongoSanitize())

// gzip compression
app.use(compression())

app.use(cors())

app.get('/', (_req, res) => {
  res.send('Healthy')
})

app.use(APP_PREFIX_PATH, routes)

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)
// handle error
app.use(errorHandler)

export default app
