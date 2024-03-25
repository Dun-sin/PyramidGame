import { APP_PREFIX_PATH, IS_TEST } from '@/config/config'
import { Server, Socket } from 'socket.io'
import { errorConverter, errorHandler } from './middlewares/error'

import ApiError from './utils/ApiError'
import CreateGame from './sockets/CreateGame'
import DeleteGame from './sockets/DeleteGame'
import JoinGame from './sockets/JoinGame'
import Vote from './sockets/Vote'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import http from 'http'
import httpStatus from 'http-status'
import mongoSanitize from 'express-mongo-sanitize'
import routes from '@/routes'

const app = express()
const server = http.createServer(app)
export const io = new Server(server)

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

export interface CustomSocket extends Socket {
  userId: string
}

io.on('connection', (socket: CustomSocket) => {
  console.log('userconnected')

  socket.on('rejoinGame', (code) => {
    socket.rooms.clear()
    socket.join(code)
  })

  CreateGame(socket)
  JoinGame(socket)
  Vote(socket)
  DeleteGame(socket)
})

export default server
