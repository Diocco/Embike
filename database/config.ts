import 'dotenv/config';
import mongoose from "mongoose";

const conexionDB = async() => {
    // Manejo de errores por si falla la conexion
    try {
        //Conecta la base de datos usando la variable global como argumento
        await mongoose.connect(process.env.MONGO_DB!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }) ;
        console.log("Base de datos conectada con exito");
    } catch (error) {
        console.log("No se pudo conectar con la base de datos");
        throw new Error("No se pudo conectar con la base de datos");
    }
}



export {conexionDB}