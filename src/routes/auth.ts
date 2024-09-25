
import express from 'express'; // Express
import { check } from 'express-validator'; // Validaciones

// Controladores
import { login } from '../controllers/auth'

// Middlewares
import { validarCampos } from '../middlewares/validarCampos';

// Validaciones
import { correoExiste } from '../../database/verificaciones';


const router = express.Router();

router.post('/login',
    check('correo').isEmail().withMessage('Email invalido'),
    check('correo').custom( correoExiste ), 
    check('password', 'La contraseña es debe tener entre 8 y 20 caracteres').isLength({min:8,max:20}), 
    validarCampos,
    login) // Crea un nuevo usuario

// router.put('/:id',) //Actualiza un usuario

// router.get('/',) // Devuelve los usuarios 

// router.delete('/:id',)



export default router;