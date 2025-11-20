import express from 'express'
import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'


const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors:{
        origin: process.env.CORS_ORIGIN || '',
        methods: ['GET', 'POST'],
        credentials: true
    }
})


app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))














export default app