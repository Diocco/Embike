import { ObjectId } from "mongoose";
import { error } from "../../../interfaces/error.js";
import { producto } from "../../../models/interfaces/producto.js";
import { tokenAcceso, urlCategorias, urlProductos } from "../global.js";
import { mostrarMensaje } from "../helpers/mostrarMensaje.js";

export const mostrarErroresConsola =(errores:error[])=>{
        mostrarMensaje('',true);
        errores.forEach((error:error) => { // Recorre los errores
            console.log(error.msg);
        })
}

// Realiza la peticion GET para obtener los productos
export const obtenerProductos=async(desde:string,hasta:string,precioMin:string,precioMax:string,palabraBuscada:string,categorias:string,ordenar:string)=>{
    let productos:producto[] = []
    await fetch(urlProductos+`?variantes=true&desde=${desde}&hasta=${hasta}&precioMin=${precioMin}&precioMax=${precioMax}&palabraBuscada=${palabraBuscada}&categorias=${categorias}&ordenar=${ordenar}`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Maneja la respuesta del servidor
        if(data.errors) mostrarErroresConsola (data.errors) // Si hay errores de tipeo los muestra en consola 
        else productos = data.productos // Si no hay errores entonces almacena la respuesta del servidor
    })
    .catch(error => { // Si hay un error se manejan y se muestra en consola
        mostrarMensaje('2',true);
        console.error(error);
    })

    return productos
}


// Carga las categorias validas en el DOM
export const buscarCategoriasValidas=async()=>{
    let nombreCategorias:string[] = []
    await fetch(
        urlCategorias+`?nombres=true`, { // Realiza la peticion GET para obtener un string[] con los nombres de las categorias validas
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Maneja la respuesta del servidor
        if(data.errors) mostrarErroresConsola (data.errors) // Si hay errores de tipeo los muestra en consola 
        else nombreCategorias = data.categorias // Si el servidor no devuelve errores guarda la respuesta
    })
    .catch(error => { // Si hay un error se manejan 
        mostrarMensaje('2',true)
        console.error(error);
    })
    return nombreCategorias
}

// Sube una nueva foto del producto al servidor
export const subirFotoProducto =async(productoID:string,imagenNueva?:File,URLImagenVieja?:string):Promise<producto | undefined>=>{
    
    const formData = new FormData()
    if(imagenNueva) formData.append('img',imagenNueva) // Si se envia una imagen para agregar, la agrega al FormData
    if(URLImagenVieja) formData.append('URLImagenVieja',URLImagenVieja) // Si se envia una imagen para eliminar la agrega al FormData

    return actualizarProducto(formData,productoID)
}

export const actualizarProducto= async(datosProducto:FormData,productoId:string)=>{

    let productoActualizado:producto|undefined = undefined
    await fetch(urlProductos+`/${productoId}`, {
        method: 'PUT',
        headers: { 'tokenAcceso':`${tokenAcceso}`},
        body: datosProducto
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Maneja la respuesta del servidor
        if(data.errors) mostrarErroresConsola (data.errors) // Si hay errores de tipeo los muestra en consola 
        else productoActualizado = data.productoActualizado // Si el servidor no devuelve errores guarda la respuesta
    })
    .catch(error => { // Si hay un error se manejan 
        console.error(error);
        mostrarMensaje('2',true);
    })

    return productoActualizado
}

export const crearProducto= async(datosProducto?:FormData):Promise<producto | undefined>=>{

    if(!datosProducto){
        datosProducto = new FormData()
        datosProducto.append('nombre','Sin nombre')
        datosProducto.append('marca','Sin marca')
        datosProducto.append('modelo','Sin modelo')
        datosProducto.append('categoria','672956b70e8cd0e8b1fee8aa') // Id de la categoria "Sin categoria"
    }

    let productoCreado:producto|undefined = undefined

    await fetch(urlProductos, {
        method: 'POST',
        headers: { 'tokenAcceso':`${tokenAcceso}`},
        body: datosProducto
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Maneja la respuesta del servidor
        if(data.errors) mostrarErroresConsola (data.errors) // Si hay errores de tipeo los muestra en consola 
        else productoCreado = data // Si el servidor no devuelve errores guarda la respuesta
    })
    .catch(error => { // Si hay un error se manejan 
        console.error(error);
        mostrarMensaje('2',true);
    })

    return productoCreado
}