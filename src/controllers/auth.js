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
exports.login = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generarJWT_1 = require("../../helpers/generarJWT");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, password } = req.body;
    const usuario = yield usuario_1.default.findOne({ correo }); // Previamente se verifico que el usuario existe
    // Validar contraseña
    const contraseñaValida = bcryptjs_1.default.compareSync(password, usuario.password); // Verifica que la contraseña sea correcta
    if (!contraseñaValida) { // Si la contraseña no es correcta:
        return res.status(400).json({
            errors: [{
                    msg: "Contraseña incorrecta",
                    path: "password"
                }]
        });
    }
    // Generar JWT 
    const token = yield (0, generarJWT_1.generarJWT)(usuario.id);
    res.status(200).json({
        msg: "Login Realizado con exito",
        token,
        usuario,
    });
});
exports.login = login;
