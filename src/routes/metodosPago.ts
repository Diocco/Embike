import express from 'express'; // Express
import { check } from 'express-validator'; // Validaciones
import { crearMetodoPago, verMetodosPago } from '../controllers/metodosPago.js';
import { validarJWT } from '../middlewares/validarJWT.js';
import { validarRolJWT } from '../middlewares/validarRolJWT.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { metodoPagoNombreUnico, metodoPagoTipoValido } from '../../database/metodosPagoVerificaciones.js';

const router = express.Router();

router.get('/', // Obtener metodos de pago - Admin
    validarJWT, // Valida que el usuario que realiza la accion sea valido
    validarRolJWT('admin'), // Valida que el usuario tenga permisos de administrador

    validarCampos,
    verMetodosPago) 

router.post('/', // Crear metodo de pago - Admin
    validarJWT, // Valida que el usuario que realiza la accion sea valido
    validarRolJWT('admin'), // Valida que el usuario tenga permisos de administrador

    check('nombre').custom(metodoPagoNombreUnico),
    check('tipo').custom(metodoPagoTipoValido),
    validarCampos,
    crearMetodoPago)

export default router;