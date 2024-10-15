var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Usuario from '../models/usuario.js';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../../helpers/generarJWT.js';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, password } = req.body;
    const usuario = yield Usuario.findOne({ correo }); // Previamente se verifico que el usuario existe
    // Validar contraseña
    const contraseñaValida = bcryptjs.compareSync(password, usuario.password); // Verifica que la contraseña sea correcta
    if (!contraseñaValida) { // Si la contraseña no es correcta:
        return res.status(400).json({
            errors: [{
                    msg: "Contraseña incorrecta",
                    path: "password"
                }]
        });
    }
    // Generar JWT 
    const token = yield generarJWT(usuario.id);
    res.status(200).json({
        msg: "Login Realizado con exito",
        token,
        usuario,
    });
});
export { login };
