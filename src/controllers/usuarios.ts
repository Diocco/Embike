import { Request, Response } from 'express';
import bcryptjs, { hashSync } from 'bcryptjs';

import Usuario from '../models/usuario';



const agregarUsuario = async(req: Request, res: Response) => {

    //Desestructura la informacion entrante para usar solo lo que se requiera
    const {nombre,password,correo,rol} = req.body;

    // Crea una nueva entrada con el modelo "Usuario"
    const usuario = new Usuario( {nombre,password,correo,rol} ); // A la entrada le agrega la informacion que viene en el body

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync() // Genera un "salt" para indicar el nivel de encriptacion
    usuario.password = hashSync(password, salt) // Genera un hash relacionado a la contraseña del usuario

    await usuario.save(); // Guarda el modelo en la base de datos

    res.status(201).json({ //Devuelve un mensaje y el usuario agregado a la base de datos
        msg: "Usuario guardado en la base de datos",
        usuario
    })
};

const actualizarUsuario = async(req: Request, res: Response) =>{
    const { id } = req.params; 
    const { nombre, activo, google, _id, __v, password, ...resto  } = req.body // Deja en "resto" las propiedades que son modificables
    // TODO El password tiene que tomarse (si existe), encriptarlo y volverlo a meter "resto" para su actualizacion
    if(password){ // Si se mando una contraseña:
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync() // Genera un "salt" para indicar el nivel de encriptacion
        resto.password = hashSync(password, salt) // Genera un hash relacionado a la contraseña del usuario y la agrega al resto de propiedades
    }

    const usuario = await Usuario.findByIdAndUpdate( id , resto, { new: true }); // Busca por id en la base de datos que actualiza las propiedades que esten en "resto". { new: true } devuelve el documento actualizado

    res.status(200).json({ //Devuelve un mensaje y el usuario agregado a la base de datos
        msg: "Usuario actualizado en la base de datos",
        usuario
    })
}

export {
    agregarUsuario,
    actualizarUsuario
}