"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarIDJWT = void 0;
// Verifica que el rol del usuario autenticado mediante JWT sea del rol o roles pasados como argumentos
const validarIDJWT = (req, res, next) => {
    const usuario = req.usuario; // Recupera el usuario del JWT
    const id = req.params.id;
    if (!usuario) { // Si no se encontro ningun usuario entonces:
        return res.status(500).json({
            msg: 'Se quiere validar el id del token sin antes validar el token'
        });
    }
    if (!id) { // Si no se encontro ningun usuario entonces:
        return res.status(500).json({
            msg: 'Se quiere validar el id sin verificar que venga como argumento'
        });
    }
    const usuarioID = usuario._id.toString(); // Convierte el ObjectID a un string para poder realizar la comporaracion de los ID
    const idValido = usuarioID === id; // Verifica que el id del usuario que se pasa como argumento sea el mismo que el del token
    if (!idValido) { // Si no es el mismo entonces lanza un error
        return res.status(401).json({
            msg: `No puede modificar parametros de otro usuario`
        });
    }
    next();
};
exports.validarIDJWT = validarIDJWT;