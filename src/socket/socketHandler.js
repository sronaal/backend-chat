import jwt from 'jsonwebtoken'

import User from '../models/User.js'



// Almacen Usuarios conectados { userId: socketId } 
const connectedUsers = new Map()


export const initializeSocket = (io) => {

    /**
     * Middleware de autenticacion para Socket
     * 
     */
    io.use(async (socket, next) => {

        try {
            const token = socket.handshake.auth.token

            if(!token) {
                return new(new Error("Autenticación Fallida"))
            }

            const decode = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decode.id).select('-password')
            
            if(!user) {
                return next(new Error('Usuario no encontrado'))
            }

            socket.userId = user._id.toString()
            socket.user = user;
            next()

        } catch (error) {
            next(new Error('Autenticación Fallida'))
        }
    })
}