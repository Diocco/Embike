import express from 'express'; // Express
import { validarRolJWT,validarJWT, validarCampos } from '../middlewares/index.js';
import { check } from 'express-validator';
import { modificarRegistro, registrarVenta, verRegistro, verRegistroVentas } from '../controllers/registroVentas.js';
const router = express.Router();

router.post('/', // Crear registro de venta - Admin
    validarJWT, // Valida que el usuario que realiza la accion sea valido
    validarRolJWT('admin'), // Valida que el usuario tenga permisos de administrador

    check('carrito', 'El carrito es obligatorio').notEmpty(),
    check('lugarVenta', 'El lugar no tiene formato valido').optional().isString(),
    check('fechaVenta', 'La fecha es obligatoria').notEmpty(),
    check('total', 'El total es obligatorio').notEmpty(),
    check('pago1', 'El primer pago es obligatorio').notEmpty(),
    check('metodo1', 'El metodo de pago es obligatorio').notEmpty(),
    check('descuento', 'El lugar no tiene formato valido').optional().isNumeric(),
    check('promocion').optional(), // TODO: Valida el id del codigo de descuento con la base de datos de codigos de descuentos
    check('observacion', 'La observacion no tiene formato valido').optional().isString(),
    check('cliente').optional(), // TODO: Valida el id del cliente con la base de datos de usuarios
    check('elementos').optional(), // TODO: Valida que los elementos tengan formato valido
    check('vendedor', 'El vendedor no tiene formato valido').optional().isString(),
    check('estado', 'El estado de la venta es obligatorio').notEmpty(),
    check('modificaciones').optional(), // TODO: Valida que los las modificaciones tengan formato valido
    
    validarCampos,
    registrarVenta) 

router.get('/:id', // Obtener registro por ID
    validarJWT, // Valida que el usuario que realiza la accion sea valido
    verRegistro) 

router.get('/', // Obtener registros
    validarJWT, // Valida que el usuario que realiza la accion sea valido
    verRegistroVentas) 

router.put('/',
    validarJWT, // Valida que el usuario que realiza la accion sea valido
    validarRolJWT('admin'), // Valida que el usuario tenga permisos de administrador
    check('id','El id del registro es obligatorio').notEmpty(),

    validarCampos,
    modificarRegistro
)

export default router;