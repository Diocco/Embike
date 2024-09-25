"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Express
const express_validator_1 = require("express-validator"); // Validaciones
// Controladores
const auth_1 = require("../controllers/auth");
// Middlewares
const validarCampos_1 = require("../middlewares/validarCampos");
// Validaciones
const verificaciones_1 = require("../../database/verificaciones");
const router = express_1.default.Router();
router.post('/login', (0, express_validator_1.check)('correo').isEmail().withMessage('Email invalido'), (0, express_validator_1.check)('correo').custom(verificaciones_1.correoExiste), (0, express_validator_1.check)('password', 'La contraseña es debe tener entre 8 y 20 caracteres').isLength({ min: 8, max: 20 }), validarCampos_1.validarCampos, auth_1.login); // Crea un nuevo usuario
// router.put('/:id',) //Actualiza un usuario
// router.get('/',) // Devuelve los usuarios 
// router.delete('/:id',)
exports.default = router;
