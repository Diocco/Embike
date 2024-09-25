"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid }; // Define que informacion del usuario va a llevar el JWT
        const secretOrPrivateKey = process.env.SECRETORPRIVATEKEY; // Clave para la encriptacion
        jsonwebtoken_1.default.sign(payload, secretOrPrivateKey, {
            expiresIn: '4h' // Define cuando expira el token
        }, (err, token) => {
            if (err) { // Si hay un error...
                console.log(err);
                reject('No se pudo generar el token');
            }
            else { // Si no hay errores devuelve el token
                resolve(token);
            }
        });
    });
};
exports.generarJWT = generarJWT;
