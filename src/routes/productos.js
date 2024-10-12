"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Express
const express_validator_1 = require("express-validator"); // Validaciones
// Controladores
const productos_1 = require("../controllers/productos");
// Middlewares
const middlewares_1 = require("../middlewares");
// Verificaciones con la base de datos
const categoriasVerificaciones_1 = require("../../database/categoriasVerificaciones");
const productosVerificaciones_1 = require("../../database/productosVerificaciones");
const router = express_1.default.Router();
router.get('/', // Obtener productos
productos_1.verProductos);
router.get('/:id', // Obtener producto por id
(0, express_validator_1.check)('id').custom(productosVerificaciones_1.productoExiste), middlewares_1.validarCampos, productos_1.verProductoID);
router.post('/', // Crear producto - Admin
middlewares_1.validarJWT, // Valida que el usuario que realiza la accion sea valido
(0, middlewares_1.validarRolJWT)('admin'), // Valida que el usuario tenga permisos de administrador
(0, express_validator_1.check)('nombre', 'El nombre es obligatorio').notEmpty(), (0, express_validator_1.check)('marca', 'La marca es obligatoria check').notEmpty(), (0, express_validator_1.check)('modelo', 'El modelo es obligatorio check').notEmpty(), (0, express_validator_1.check)('categoria', 'La categoria es obligatoria').notEmpty(), (0, express_validator_1.check)('categoria').custom(categoriasVerificaciones_1.categoriaValida), (0, express_validator_1.check)('variantes', 'Las variantes son obligatorias').notEmpty(), (0, express_validator_1.check)('variantes').custom(productosVerificaciones_1.variantesValidas), middlewares_1.validarCampos, productos_1.crearProducto);
router.put('/variante/:id', // Agrega o actuliza una variante de un producto - Admin
middlewares_1.validarJWT, // Valida que el usuario que realiza la accion sea valido
(0, middlewares_1.validarRolJWT)('admin'), // Valida que el usuario tenga permisos de administrador
(0, express_validator_1.check)('id').custom(productosVerificaciones_1.productoExiste), (0, express_validator_1.check)('talle', 'El talle es obligatorio').notEmpty(), (0, express_validator_1.check)('color', 'El color es obligatorio').notEmpty(), (0, express_validator_1.check)('SKU', "El SKU debe tener formato 'string'").optional().isString(), (0, express_validator_1.check)('SKU').optional().custom(productosVerificaciones_1.SKUUnico), middlewares_1.validarCampos, productos_1.agregarVariante);
router.put('/:id', // Actualizar producto - Admin
middlewares_1.validarJWT, // Valida que el usuario que realiza la accion sea valido
(0, middlewares_1.validarRolJWT)('admin'), // Valida que el usuario tenga permisos de administrador
(0, express_validator_1.check)('id').custom(productosVerificaciones_1.productoExiste), middlewares_1.validarCampos, productos_1.actualizarProducto);
router.delete('/:id', // Actualizar producto - Admin
middlewares_1.validarJWT, // Valida que el usuario que realiza la accion sea valido
(0, middlewares_1.validarRolJWT)('admin'), // Valida que el usuario tenga permisos de administrador
(0, express_validator_1.check)('id').custom(productosVerificaciones_1.productoExiste), middlewares_1.validarCampos, productos_1.eliminarProducto);
exports.default = router;
