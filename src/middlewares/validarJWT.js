var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';
export const validarJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const secretOrPrivateKey = process.env.SECRETORPRIVATEKEY;
    const token = req.header('tokenAcceso'); // Obtiene el JWT de los headers de la solicitud
    if (!token) { // Si no se envia un token en la request:
        return res.status(401).json({
            errors: [{
                    msg: 'No se encontro el token',
                    path: "accesoToken"
                }]
        });
    }
    try {
        // Verifica que el token sea valido
        const { uid } = jwt.verify(token, secretOrPrivateKey); // Si es valido devuelve el token desencriptado, del cual se extrae el uid
        const usuario = yield Usuario.findById(uid); // Busca el usuario que posee con el id del token
        if (!usuario) { // Si no se encontro el usuario:
            return res.status(401).json({
                errors: [{
                        msg: 'Token no valido - El usuario no existe',
                        path: "accesoToken"
                    }]
            });
        }
        if (!usuario.activo) { // Si el usuario no esta activo:
            return res.status(401).json({
                errors: [{
                        msg: 'Token no valido - El usuario no esta activo',
                        path: "accesoToken"
                    }]
            });
        }
        req.body.usuario = usuario; // Define el uid del usuario que esta realizando la solitud, en la request, para ser usado en los siguientes middlewares
        next(); // Continúa con el siguiente middleware o controlador
    }
    catch (error) { // Si el token no es valido "verify" lanzara un error y se atrapa aqui
        return res.status(401).json({
            errors: [{
                    msg: 'Token no valido',
                    path: "accesoToken"
                }]
        });
    }
});
