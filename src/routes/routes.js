"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const inicioControllers_1 = require("../controllers/inicioControllers"); // Asegúrate de la ruta correcta
const catalogo_1 = require("../controllers/catalogo"); // Asegúrate de la ruta correcta
const notFound_1 = require("../controllers/notFound"); // Asegúrate de la ruta correcta
const usuarios_1 = require("../controllers/usuarios");
const validarCampos_1 = require("../middlewares/validarCampos");
const verificaciones_1 = require("../../database/verificaciones");
const router = express_1.default.Router();
router.get('/', inicioControllers_1.cargarIndex); // Configura la ruta
router.get('/index', inicioControllers_1.cargarIndex); // Configura la ruta
router.get('/catalogo', catalogo_1.cargarCatalogo); // Configura la ruta
router.post('/api/usuarios', // Crea un nuevo usuario
(0, express_validator_1.check)('nombre', 'El nombre es obligatorio').notEmpty(), // Verifica que el nombre no este vacio
(0, express_validator_1.check)('nombre', 'El nombre es obligatorio').custom(verificaciones_1.nombreUnico), // Verifica que el nombre no exista en la base de datos
(0, express_validator_1.check)('password', 'La contraseña es debe tener entre 8 y 20 caracteres').isLength({ min: 8, max: 20 }), (0, express_validator_1.check)('correo', 'El correo no es valido').isEmail(), // Verifica que el email sea valido
(0, express_validator_1.check)('correo').custom(verificaciones_1.correoUnico), (0, express_validator_1.check)('rol').custom(verificaciones_1.esRolValido), validarCampos_1.validarCampos, // Devuelve un error al usuario si algun check fallo
usuarios_1.agregarUsuario); // Agrega un nuevo usuario a la base de datos
router.put('/api/usuarios/:id', //Actualiza un usuario
(0, express_validator_1.check)('id').custom(verificaciones_1.existeUsuario), // Verifica existencia y validez del id
(0, express_validator_1.check)('rol').optional().custom(verificaciones_1.esRolValido), // Si se manda un rol verifica que sea valido
(0, express_validator_1.check)('password', 'La contraseña es debe tener entre 8 y 20 caracteres').optional().isLength({ min: 8, max: 20 }), // Si se manda una contraseña verifica que sea valida
(0, express_validator_1.check)('correo', 'El correo no es valido').optional().isEmail(), // Si se manda un correo verifica que sea valido
validarCampos_1.validarCampos, // Devuelve un error al usuario si algun check fallo
usuarios_1.actualizarUsuario); // Agrega un nuevo usuario a la base de datos
router.get('/api/usuarios', // Devuelve los usuarios
usuarios_1.verUsuarios);
router.delete('/api/usuarios/:id', // Elimina el usuario con el id pasado como parametro
(0, express_validator_1.check)('id').custom(verificaciones_1.existeUsuario), // Verifica existencia y validez del id
validarCampos_1.validarCampos, // Devuelve un error al usuario si algun check fallo
usuarios_1.eliminarUsuario);
router.get('/*', notFound_1.cargarNotFound); // Configura la ruta
exports.default = router;
