"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usuario_1 = __importDefault(require("../models/usuario"));
const validarJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const secretOrPrivateKey = process.env.SECRETORPRIVATEKEY;
    const token = req.header('tokenAcceso'); // Obtiene el JWT de los headers de la solicitud
    if (!token) { // Si no se envia un token en la request:
        return res.status(401).json({
            msg: 'No se encontro el token de acceso'
        });
    }
    try {
        // Verifica que el token sea valido
        const { uid } = jsonwebtoken_1.default.verify(token, secretOrPrivateKey); // Si es valido devuelve el token desencriptado, del cual se extrae el uid
        const usuario = yield usuario_1.default.findById(uid); // Busca el usuario que posee con el id del token
        if (!usuario) { // Si no se encontro el usuario:
            return res.status(401).json({
                msg: 'Token no valido - El usuario no existe'
            });
        }
        if (!usuario.activo) { // Si no se encontro el usuario:
            return res.status(401).json({
                msg: 'Token no valido - El usuario no esta activo'
            });
        }
        req.usuario = usuario; // Define el uid del usuario que esta realizando la solitud, en la request, para ser usado en los siguientes middlewares
        next(); // Continúa con el siguiente middleware o controlador
    }
    catch (error) { // Si el token no es valido "verify" lanzara un error y se atrapa aqui
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }
});
exports.validarJWT = validarJWT;
