import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../../helpers/generarJWT';




const login = async(req: Request, res: Response) => {
    const { correo, password } = req.body;
    const usuario = await Usuario.findOne({correo}); // Previamente se verifico que el usuario existe

    // Validar contraseña
    const contraseñaValida = bcryptjs.compareSync(password,usuario!.password) // Verifica que la contraseña sea correcta
    if(!contraseñaValida){ // Si la contraseña no es correcta:
        return res.status(400).json({
            errors:[{
                msg: "Contraseña incorrecta",
                path: "password"
            }]
        })
    }

    // Generar JWT 
    const token = await generarJWT( usuario!.id )

    res.status(200).json({
        msg: "Login Realizado con exito",
        token,
        usuario,
    })
};

export {
    login
}