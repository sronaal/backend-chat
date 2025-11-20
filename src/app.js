import express from 'express'
import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { conexionDB } from './config/database.js'

import authRoutes from './router/auth.routes.js'


// Inicializacion App 
const app = express()
const httpServer = createServer(app)

// Socket
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || '',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

// Middlewares App
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Configuracion Rutas App
app.use('/api/v1/auth',authRoutes)

// Conexion MongoDB
conexionDB()












export default app