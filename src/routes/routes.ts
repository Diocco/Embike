import express from 'express';
import { check } from 'express-validator';



import { cargarIndex} from '../controllers/inicioControllers'; // Asegúrate de la ruta correcta
import { cargarCatalogo } from '../controllers/catalogo'; // Asegúrate de la ruta correcta
import { cargarNotFound } from '../controllers/notFound'; // Asegúrate de la ruta correcta
import { 
    actualizarUsuario,
    agregarUsuario, 
    eliminarUsuario, 
    verUsuarios } from '../controllers/usuarios';
import { validarCampos } from '../middlewares/validarCampos';
import { esRolValido, correoUnico, nombreUnico, existeUsuario } from '../../database/verificaciones';


const router = express.Router();

router.get('/', cargarIndex); // Configura la ruta
router.get('/index', cargarIndex); // Configura la ruta
router.get('/catalogo', cargarCatalogo); // Configura la ruta


router.post('/api/usuarios', // Crea un nuevo usuario
    check('nombre', 'El nombre es obligatorio').notEmpty(), // Verifica que el nombre no este vacio
    check('nombre', 'El nombre es obligatorio').custom( nombreUnico ), // Verifica que el nombre no exista en la base de datos
    check('password', 'La contraseña es debe tener entre 8 y 20 caracteres').isLength({min:8,max:20}), 
    check('correo', 'El correo no es valido').isEmail(), // Verifica que el email sea valido
    check('correo').custom( correoUnico ), 
    check('rol').custom( esRolValido ), 
    validarCampos, // Devuelve un error al usuario si algun check fallo
    agregarUsuario) // Agrega un nuevo usuario a la base de datos
    
    router.put('/api/usuarios/:id', //Actualiza un usuario
        check('id').custom( existeUsuario ), // Verifica existencia y validez del id
        check('rol').optional().custom( esRolValido ), // Si se manda un rol verifica que sea valido
        check('password', 'La contraseña es debe tener entre 8 y 20 caracteres').optional().isLength({min:8,max:20}), // Si se manda una contraseña verifica que sea valida
        check('correo', 'El correo no es valido').optional().isEmail(), // Si se manda un correo verifica que sea valido
        validarCampos, // Devuelve un error al usuario si algun check fallo
        actualizarUsuario) // Agrega un nuevo usuario a la base de datos

router.get('/api/usuarios', // Devuelve los usuarios
    verUsuarios) 

router.delete('/api/usuarios/:id', // Elimina el usuario con el id pasado como parametro
        check('id').custom( existeUsuario ), // Verifica existencia y validez del id
        validarCampos, // Devuelve un error al usuario si algun check fallo
    eliminarUsuario)






router.get('/*', cargarNotFound); // Configura la ruta

export default router;