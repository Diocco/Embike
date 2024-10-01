import { Request, Response } from 'express';
import Categoria from '../models/categoria';



// Devuelve todas las categorias
const verCategorias = async(req: Request, res: Response)=>{
    const desde:number = Math.abs(Number(req.query.desde)) || 0;  // Valor por defecto 0 si no se pasa el parámetro o es invalido
    const cantidad:number = Math.abs(Number(req.query.cantidad)) || 10;  // Valor por defecto 10 si no se pasa el parámetro o es invalido

    const condicion = {estado:true}; // Condicion/es que debe cumplir la busqueda

    // Crea un array de promesas que no son independientes entre ellas para procesarlas en paralelo
    const [usuarios, usuariosCantidad] = await Promise.all([ // Una vez que se cumplen todas se devuelve un array con sus resultados
        Categoria.find(condicion).populate('usuario')  // Busca a todos los usuarios en la base de datos que cumplen la condicion
            .skip(desde).limit(cantidad),
        Categoria.countDocuments(condicion) // Devuelve la cantidad de objetos que hay que cumplen con la condicion
    ])

    // Indica la cantidad de paginas que se necesitan para mostrar todos los resultados
    const paginasCantidad = Math.ceil(usuariosCantidad/cantidad); 

    res.status(200).json({
        usuariosCantidad,
        paginasCantidad,
        usuarios
    })
}

// Devuelve la categoria con el id pasado como parametro
const verCategoriaID = async(req: Request, res: Response)=>{
    const { id } = req.params
    const condicion = {estado:true}; // Condicion/es que debe cumplir la busqueda de la categoria

    const categoria = await Categoria.findById(id,condicion).populate('usuario')

    res.status(200).json(categoria)
}

// Crea una nueva categoria
const crearCategoria = async(req: Request, res: Response)=>{
    const nombre = req.body.nombre
    const usuario = req.body.usuario

    // Verifica que el nombre sea unico
    const categoriaDB = await Categoria.findOne({ nombre })

    if(categoriaDB){ // Si la categoria se encontro en la base de datos:
        return res.status(400).json({
            errors:[{
                msg: "La categoria ya existe",
                path: "nombre"
            }]
        })
    }

    // Si paso todas las verificaciones entonces:
    const data={
        nombre,
        usuario
    };


    const categoria = new Categoria( data ) // Crea una nueva categoria
    await categoria.save() // La guarda en la base de datos
    
    res.json(`Se creo la categoria ${nombre}`)
}

// Actualiza una categoria con el id pasado como parametro
const actualizarCategoria = async(req: Request, res: Response)=>{
    const { id } = req.params; 
    const { nombre } = req.body // Extrae el parametro que sea modificable

    // Busca por id en la base de datos que actualiza las propiedades que esten en el segundo parametro. { new: true } devuelve el documento actualizado
    const categoriaActualizada = await Categoria.findByIdAndUpdate( id,{ nombre }, { new: true }); 

    res.status(200).json({ //Devuelve un mensaje y el usuario agregado a la base de datos
        msg: "Categoria actualizada en la base de datos",
        categoriaActualizada
    })
}

// Elimina una categoria con el id pasado como parametro
const eliminarCategoria = async(req: Request, res: Response) =>{

    const {id} = req.params; // Desestructura el id
    // Busca la categoria con ese id y cambia su estado de actividad
    const categoriaEliminada = await Categoria.findByIdAndUpdate( id , {estado: false}, { new: true }); 
    const usuarioAutenticado = req.body.usuario
    res.status(200).json({
        categoriaEliminada,
        usuarioAutenticado
    })
}




export {
    verCategorias,
    verCategoriaID,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}