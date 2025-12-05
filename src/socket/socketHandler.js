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

            if (!token) {
                return new (new Error("Autenticación Fallida"))
            }

            const decode = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decode.id).select('-password')

            if (!user) {
                return next(new Error('Usuario no encontrado'))
            }

            socket.userId = user._id.toString()
            socket.user = user;
            next()

        } catch (error) {
            next(new Error('Autenticación Fallida'))
        }
    })

    /**
     * Manejador de Conexiones
     * 
     * Se ejecuta cada vez que un cliente autenticado se conecta exitosamente
     */

    io.on('connection', async (socket) => {
        console.log(`[-] Usuario Conectado ${socket.user.username} (${socket.id})`)

        // Almacenar usuarios conectados en memoria
        connectedUsers.set(socket.userId, socket.id)

        // Actualizar estado en base de datos a online
        await User.findByIdAndUpdate(socket.userId, { online: true })

        // Unir al usuario a su propia sala (usando su userId)
        // Esto permite enviar mensajes privados o notificaciones específicas a este usuario
        socket.join(socket.userId)

        // Emitir evento 'user_online' a TODOS los demás usuarios conectados
        socket.broadcast.emit('user_online', {
            userId: socket.userId,
            username: socket.user.username
        })

        // Enviar la lista actual de usuarios conectados al usuario que recien ingreso
        const onlineUserIds = Array.from(connectedUsers.keys())
        socket.emit('online_users', onlineUserIds)


        /**
         * Evento: join_chat
         * El cliente solicita unirse a una sala de chat específica.
         * Esto es necesario para recibir mensajes en tiempo real de ese chat.
        */
        socket.on('join_chat', (chatId) => {
            socket.join(chatId)
            console.log(`[-] User ${socket.user.username} joined chat ${chatId}`)
        })


        /**
         * Evento: leave_chat
         * El cliente abandona una sala de chat
         */
        socket.on('leave_chat', (chatId) => {
            socket.leave(chatId)
            console.log(`User ${socket.user.username} left chat: ${chatId}`);

        })

    })
}