import mongoose from "mongoose";

export const conexionDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connect ${conn.connection.host}`)
        
    }
     catch (error) {
        console.error(`MongoDB Connection Error: ${error}`)
        setTimeout(conexionDB, 5000)

    }
}