"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Express
const express_validator_1 = require("express-validator"); // Validaciones
// Controladores
const usuarios_1 = require("../controllers/usuarios");
// Middlewares
const middlewares_1 = require("../middlewares");
// Verificaciones con la base de datos
const usuariosVerificaciones_1 = require("../../database/usuariosVerificaciones");
const router = express_1.default.Router();
router.post('/', // Crea un nuevo usuario
(0, express_validator_1.check)('nombre', 'El nombre es obligatorio').notEmpty(), // Verifica que el nombre no este vacio
(0, express_validator_1.check)('nombre', 'El nombre es obligatorio').custom(usuariosVerificaciones_1.nombreUnico), // Verifica que el nombre no exista en la base de datos
(0, express_validator_1.check)('password', 'La contraseña es debe tener entre 8 y 20 caracteres').isLength({ min: 8, max: 20 }), (0, express_validator_1.check)('correo', 'El correo no es valido').isEmail(), // Verifica que el email sea valido
(0, express_validator_1.check)('correo').custom(usuariosVerificaciones_1.correoUnico), (0, express_validator_1.check)('rol').custom(usuariosVerificaciones_1.esRolValido), middlewares_1.validarCampos, // Devuelve un error al usuario si algun check fallo
usuarios_1.agregarUsuario); // Agrega un nuevo usuario a la base de datos
router.put('/:id', //Actualiza un usuario
(0, express_validator_1.check)('id').custom(usuariosVerificaciones_1.usuarioExiste), // Verifica existencia y validez del id
middlewares_1.validarJWT, middlewares_1.validarIDJWT, (0, express_validator_1.check)('rol').optional().custom(usuariosVerificaciones_1.esRolValido), // Si se manda un rol verifica que sea valido
(0, express_validator_1.check)('password', 'La contraseña es debe tener entre 8 y 20 caracteres').optional().isLength({ min: 8, max: 20 }), // Si se manda una contraseña verifica que sea valida
(0, express_validator_1.check)('correo', 'El correo no es valido').optional().isEmail(), // Si se manda un correo verifica que sea valido
middlewares_1.validarCampos, // Devuelve un error al usuario si algun check fallo
usuarios_1.actualizarUsuario); // Agrega un nuevo usuario a la base de datos
router.get('/', // Devuelve los usuarios
usuarios_1.verUsuarios);
router.delete('/:id', // Elimina el usuario con el id pasado como parametro
middlewares_1.validarJWT, (0, middlewares_1.validarRolJWT)('admin'), (0, express_validator_1.check)('id').custom(usuariosVerificaciones_1.usuarioExiste), // Verifica existencia y validez del id
middlewares_1.validarCampos, // Devuelve un error al usuario si algun check fallo
usuarios_1.eliminarUsuario);
exports.default = router;
