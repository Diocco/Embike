import express from 'express'; // Express
import { check } from 'express-validator'; // Validaciones
// Controladores
import { verProductos, verProductoID, crearProducto, actualizarProducto, eliminarProducto, agregarVariante } from '../controllers/productos.js';
// Middlewares
import { validarCampos, validarJWT, validarRolJWT } from '../middlewares/index.js';
// Verificaciones con la base de datos
import { categoriaValida } from '../../database/categoriasVerificaciones.js';
import { productoExiste, SKUUnico, variantesValidas, } from '../../database/productosVerificaciones.js';
const router = express.Router();
router.get('/', // Obtener productos
verProductos);
router.get('/:id', // Obtener producto por id
check('id').custom(productoExiste), validarCampos, verProductoID);
router.post('/', // Crear producto - Admin
validarJWT, // Valida que el usuario que realiza la accion sea valido
validarRolJWT('admin'), // Valida que el usuario tenga permisos de administrador
check('nombre', 'El nombre es obligatorio').notEmpty(), check('marca', 'La marca es obligatoria check').notEmpty(), check('modelo', 'El modelo es obligatorio check').notEmpty(), check('categoria', 'La categoria es obligatoria').notEmpty(), check('categoria').custom(categoriaValida), check('variantes', 'Las variantes son obligatorias').notEmpty(), check('variantes').custom(variantesValidas), validarCampos, crearProducto);
router.put('/variante/:id', // Agrega o actuliza una variante de un producto - Admin
validarJWT, // Valida que el usuario que realiza la accion sea valido
validarRolJWT('admin'), // Valida que el usuario tenga permisos de administrador
check('id').custom(productoExiste), check('talle', 'El talle es obligatorio').notEmpty(), check('color', 'El color es obligatorio').notEmpty(), check('SKU', "El SKU debe tener formato 'string'").optional().isString(), check('SKU').optional().custom(SKUUnico), validarCampos, agregarVariante);
router.put('/:id', // Actualizar producto - Admin
validarJWT, // Valida que el usuario que realiza la accion sea valido
validarRolJWT('admin'), // Valida que el usuario tenga permisos de administrador
check('id').custom(productoExiste), validarCampos, actualizarProducto);
router.delete('/:id', // Actualizar producto - Admin
validarJWT, // Valida que el usuario que realiza la accion sea valido
validarRolJWT('admin'), // Valida que el usuario tenga permisos de administrador
check('id').custom(productoExiste), validarCampos, eliminarProducto);
export default router;
