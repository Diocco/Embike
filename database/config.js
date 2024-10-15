var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'dotenv/config';
import mongoose from "mongoose";
const conexionDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Manejo de errores por si falla la conexion
    try {
        //Conecta la base de datos usando la variable global como argumento
        yield mongoose.connect(process.env.MONGO_DB);
        console.log("Base de datos conectada con exito");
    }
    catch (error) {
        console.log("No se pudo conectar con la base de datos");
        throw new Error("No se pudo conectar con la base de datos");
    }
});
export { conexionDB };
