import express from 'express'; // Express
import { check } from 'express-validator'; // Validaciones

// Controladores
import { 
    actualizarUsuario,
    agregarUsuario, 
    eliminarUsuario, 
    verUsuarios } from '../controllers/usuarios';

// Middlewares
import { 
    validarCampos,
    validarJWT,
    validarRolJWT,
    validarIDJWT } from '../middlewares';


// Verificaciones con la base de datos
import { 
    esRolValido, 
    correoUnico, 
    nombreUnico, 
    usuarioExiste } from '../../database/verificaciones';


const router = express.Router();

router.post('/', // Crea un nuevo usuario
    check('nombre', 'El nombre es obligatorio').notEmpty(), // Verifica que el nombre no este vacio
    check('nombre', 'El nombre es obligatorio').custom( nombreUnico ), // Verifica que el nombre no exista en la base de datos
    check('password', 'La contraseña es debe tener entre 8 y 20 caracteres').isLength({min:8,max:20}), 
    check('correo', 'El correo no es valido').isEmail(), // Verifica que el email sea valido
    check('correo').custom( correoUnico ), 
    check('rol').custom( esRolValido ), 
    validarCampos, // Devuelve un error al usuario si algun check fallo
    agregarUsuario) // Agrega un nuevo usuario a la base de datos
    
router.put('/:id', //Actualiza un usuario
    check('id').custom( usuarioExiste ), // Verifica existencia y validez del id
    validarJWT,
    validarIDJWT,
    check('rol').optional().custom( esRolValido ), // Si se manda un rol verifica que sea valido
    check('password', 'La contraseña es debe tener entre 8 y 20 caracteres').optional().isLength({min:8,max:20}), // Si se manda una contraseña verifica que sea valida
    check('correo', 'El correo no es valido').optional().isEmail(), // Si se manda un correo verifica que sea valido
    validarCampos, // Devuelve un error al usuario si algun check fallo
    actualizarUsuario) // Agrega un nuevo usuario a la base de datos

router.get('/', // Devuelve los usuarios
    verUsuarios) 

router.delete('/:id', // Elimina el usuario con el id pasado como parametro
    validarJWT,
    validarRolJWT('admin'),
    check('id').custom( usuarioExiste ), // Verifica existencia y validez del id
    validarCampos, // Devuelve un error al usuario si algun check fallo
    eliminarUsuario)


export default router;