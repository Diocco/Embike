"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Express
const express_validator_1 = require("express-validator"); // Validaciones
// Controladores
const categorias_1 = require("../controllers/categorias");
// Middlewares
const middlewares_1 = require("../middlewares");
// Verificaciones con la base de datos
const categoriasVerificaciones_1 = require("../../database/categoriasVerificaciones");
const router = express_1.default.Router();
router.get('/', // Obtener categorias
categorias_1.verCategorias);
router.get('/:id', // Obtener categoria por id
(0, express_validator_1.check)('id').custom(categoriasVerificaciones_1.categoriaExiste), middlewares_1.validarCampos, categorias_1.verCategoriaID);
router.post('/', // Crear categoria - Admin
middlewares_1.validarJWT, // Valida que el usuario que realiza la accion sea valido
(0, middlewares_1.validarRolJWT)('admin'), // Valida que el usuario tenga permisos de administrador
(0, express_validator_1.check)('nombre', 'El nombre es obligatorio').notEmpty(), middlewares_1.validarCampos, categorias_1.crearCategoria);
router.put('/:id', // Actualizar categoria - Admin
middlewares_1.validarJWT, // Valida que el usuario que realiza la accion sea valido
(0, middlewares_1.validarRolJWT)('admin'), // Valida que el usuario tenga permisos de administrador
(0, express_validator_1.check)('id').custom(categoriasVerificaciones_1.categoriaExiste), middlewares_1.validarCampos, categorias_1.actualizarCategoria);
router.delete('/:id', // Actualizar categoria - Admin
middlewares_1.validarJWT, // Valida que el usuario que realiza la accion sea valido
(0, middlewares_1.validarRolJWT)('admin'), // Valida que el usuario tenga permisos de administrador
(0, express_validator_1.check)('id').custom(categoriasVerificaciones_1.categoriaExiste), middlewares_1.validarCampos, categorias_1.eliminarCategoria);
exports.default = router;
