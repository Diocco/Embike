import { Request, Response } from 'express';
import bcryptjs, { hashSync } from 'bcryptjs'; // Encriptar contraseña

import Usuario from '../models/usuario';
import { generarJWT } from '../../helpers/generarJWT';



const agregarUsuario = async(req: Request, res: Response) => {

    //Desestructura la informacion entrante para usar solo lo que se requiera
    const {nombre,password,correo,rol} = req.body;

    // Crea una nueva entrada con el modelo "Usuario"
    const usuario = new Usuario( {nombre,password,correo,rol} ); // A la entrada le agrega la informacion que viene en el body

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync() // Genera un "salt" para indicar el nivel de encriptacion
    usuario.password = hashSync(password, salt) // Genera un hash relacionado a la contraseña del usuario

    await usuario.save(); // Guarda el modelo en la base de datos

    // Generar JWT 
    const token = await generarJWT( usuario!.id )

    res.status(201).json({ //Devuelve un mensaje y el usuario agregado a la base de datos
        msg: "Usuario guardado en la base de datos",
        token,
        usuario
    })
};

const actualizarUsuario = async(req: Request, res: Response) =>{
    const { id } = req.params; 
    const { nombre, activo, google, _id, __v, password, ...resto  } = req.body // Deja en "resto" las propiedades que son modificables

    if(password){ // Si se mando una contraseña:
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync() // Genera un "salt" para indicar el nivel de encriptacion
        resto.password = hashSync(password, salt) // Genera un hash relacionado a la contraseña del usuario y la agrega al resto de propiedades
    }

    // Busca por id en la base de datos que actualiza las propiedades que esten en "resto". { new: true } devuelve el documento actualizado
    const usuario = await Usuario.findByIdAndUpdate( id , { resto }, { new: true }); 

    res.status(200).json({ //Devuelve un mensaje y el usuario agregado a la base de datos
        msg: "Usuario actualizado en la base de datos",
        usuario
    })
}

const verUsuarios = async(req: Request, res: Response) =>{

    const desde:number = Math.abs(Number(req.query.desde)) || 0;  // Valor por defecto 0 si no se pasa el parámetro o es invalido
    const cantidad:number = Math.abs(Number(req.query.cantidad)) || 10;  // Valor por defecto 10 si no se pasa el parámetro o es invalido

    const condicion = {activo:true}; // Condicion que debe cumplir la busqueda de usuarios

    // Crea un array de promesas que no son independientes entre ellas para procesarlas en paralelo
    const [usuarios, usuariosCantidad] = await Promise.all([ // Una vez que se cumplen todas se devuelve un array con sus resultados
        Usuario.find(condicion)  // Busca a todos los usuarios en la base de datos que cumplen la condicion
            .skip(desde).limit(cantidad),
        Usuario.countDocuments(condicion) // Devuelve la cantidad de objetos que hay que cumplen con la condicion
    ])

    // Indica la cantidad de paginas que se necesitan para mostrar todos los resultados
    const paginasCantidad = Math.ceil(usuariosCantidad/cantidad); 

    res.status(200).json({
        usuariosCantidad,
        paginasCantidad,
        usuarios
    })
}

const eliminarUsuario = async(req: Request, res: Response) =>{

    const {id} = req.params; // Desestructura el id
    // Busca el usuario con ese id y cambia su estado de actividad
    const usuario = await Usuario.findByIdAndUpdate( id , {activo: false}, { new: true }); 
    const usuarioAutenticado = req.body.usuario
    res.status(200).json({
        usuario,
        usuarioAutenticado
    })
}




export {
    agregarUsuario,
    actualizarUsuario,
    verUsuarios,
    eliminarUsuario
}