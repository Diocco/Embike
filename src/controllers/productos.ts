import { Request, Response } from 'express';
import Producto from '../models/productos';
import Categoria from '../models/categoria';
import mongoose from 'mongoose';



// Devuelve todas las productos
const verProductos = async(req: Request, res: Response)=>{
    const desde:number = Math.abs(Number(req.query.desde)) || 0;  // Valor por defecto 0 si no se pasa el parámetro o es invalido
    const cantidad:number = Math.abs(Number(req.query.cantidad)) || 10;  // Valor por defecto 10 si no se pasa el parámetro o es invalido
    const precioMin:number = Math.abs(Number(req.query.precioMin)) || 0 // Precio minimo del producto
    const precioMax:number = Math.abs(Number(req.query.precioMax)) || 1000000000 // Precio maximo del producto
    const palabraBuscada:string = req.query.palabraBuscada as string || ''; // Palabra buscada por el usuario
    const categoriasNombresCadena:string = req.query.categorias as string || ''; // Categorias especificadas por el usuario en formato de cadena con separador por coma Ej:(categ1,categ2,categ3,)

    const categoriasNombreArreglo:string[] = categoriasNombresCadena.split(',').filter(Boolean) // Convierte la cadena en un arreglo

    // Busca las categorías por sus nombres
    let categoriasEncontradas
    if(categoriasNombreArreglo[0]){ // Si se pasa como argumento las categorias especificas:
        categoriasEncontradas = await Categoria.find({ nombre: {$in: categoriasNombreArreglo}});
    }else{ // Si no se busco ninguna categoria en particular entonces busca todas las categorias validas
        categoriasEncontradas = await Categoria.find();
    }

    // Extrae los ObjectId de las categorías encontradas
    const categoriasIds: mongoose.Types.ObjectId[] = categoriasEncontradas.map(categoria => categoria._id);


    // Definir la expresión regular para buscar productos cuyo nombre, descripción, etc., contenga la palabra buscada
    const palabraBuscadaRegExp = new RegExp(palabraBuscada, 'i');

    const filtros = {
        // Los filtros opcionales donde el valor buscado puede estar en varias propiedades
        $or: [
            { nombre: palabraBuscadaRegExp },
            { descripcion: palabraBuscadaRegExp },
            { tags: { $in: [palabraBuscadaRegExp] } }  // Aquí el uso de $in, pero asegurándonos que tags es un array
        ],
        $and: [
            { estado: true },  // El producto debe estar disponible
            { precio: { $gte: precioMin, $lte: precioMax } },  // Rango de precios
            { categoria: { $in: categoriasIds } }  // Las categorías deben ser parte de las seleccionadas
        ]
    };













    
    // Crea un array de promesas que no son independientes entre ellas para procesarlas en paralelo
    const [productos, productosCantidad] = await Promise.all([ // Una vez que se cumplen todas se devuelve un array con sus resultados
        Producto.find(filtros)  // Busca a todos los productos en la base de datos que cumplen la condicion
            .skip(desde).limit(cantidad),
        Producto.countDocuments(filtros) // Devuelve la cantidad de objetos que hay que cumplen con la condicion
    ])

    // Indica la cantidad de paginas que se necesitan para mostrar todos los resultados
    const paginasCantidad = Math.ceil(productosCantidad/cantidad); 

    res.status(200).json({
        categoriasIds,
        productosCantidad,
        paginasCantidad,
        productos
    })
}

// Devuelve la producto con el id pasado como parametro
const verProductoID = async(req: Request, res: Response)=>{
    const { id } = req.params


    const producto = await Producto.findById(id)

    res.status(200).json(producto)
}

// Crea una nueva producto
const crearProducto = async(req: Request, res: Response)=>{
    const { nombre,categoria,descripcion,SKU,precio,caracteristicas,color,stock,disponible,imagenes,tags } = req.body
    const usuario = req.body.usuario

    const data={
        nombre,
        usuario,
        categoria,
        descripcion,
        SKU,
        precio,
        caracteristicas,
        color,
        stock,
        disponible,
        imagenes,
        tags
        }

    const producto = new Producto( data ) // Crea una nueva producto
    await producto.save() // La guarda en la base de datos
    
    res.json(`Se creo la producto ${nombre}`)
}

// Actualiza una producto con el id pasado como parametro
const actualizarProducto = async(req: Request, res: Response)=>{
    const { id } = req.params; 
    const { nombre,categoria,descripcion,SKU,precio,caracteristicas,color,stock,disponible,imagenes,tags } = req.body // Extrae el parametro que sea modificable

    // Busca por id en la base de datos que actualiza las propiedades que esten en el segundo parametro. { new: true } devuelve el documento actualizado
    const productoActualizado = await Producto.findByIdAndUpdate( id,{ nombre,categoria,descripcion,SKU,precio,caracteristicas,color,stock,disponible,imagenes,tags }, { new: true }); 

    res.status(200).json({ //Devuelve un mensaje y el producto agregado a la base de datos
        msg: "Producto actualizado en la base de datos",
        productoActualizado
    })
}

// Elimina un producto con el id pasado como parametro
const eliminarProducto = async(req: Request, res: Response) =>{

    const {id} = req.params; // Desestructura el id
    // Busca la producto con ese id y cambia su estado de actividad
    const productoEliminado = await Producto.findByIdAndUpdate( id , {estado: false}, { new: true }); 
    const usuarioAutenticado = req.body.producto
    res.status(200).json({
        productoEliminado,
        usuarioAutenticado
    })
}




export {
    verProductos,
    verProductoID,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}