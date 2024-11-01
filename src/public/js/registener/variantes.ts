import { ObjectId } from "mongoose";
import { variante } from "../../../models/interfaces/variante.js";
import { tokenAcceso, urlVariantes } from "../global.js";
import { mostrarMensaje } from "../helpers/mostrarMensaje.js";
import { error } from "../../../interfaces/error.js";

export const crearVariante = async(variante:variante)=>{

    // Crea un formdata para enviar los datos de forma tal que se puedan ser chequeados por los middlewares
    const formData = new FormData()
    formData.append('producto',variante.producto.toString())
    formData.append('SKU',variante.SKU)
    formData.append('talle',variante.talle)
    formData.append('color',variante.color)
    formData.append('stock',variante.stock.toString())

    return fetch(urlVariantes, { 
        method: 'POST',
        headers: {'tokenAcceso' : `${tokenAcceso}`  },
        body:formData
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            mostrarMensaje('',true);
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error);
            })
        }else{ // Si el servidor no devuelve errores:
            return data._id as ObjectId
        }
    })
    .catch(error => { // Si hay un error se manejan 
        mostrarMensaje('2',true);
        console.error(error);
    })
}

export const verVariantes = async(productoId:ObjectId)=>{
    // Envia el id del producto y el servidor devuelve todas las variantes para ese producto
    return fetch(urlVariantes+`/${productoId.toString()}`, { 
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            mostrarMensaje('',true);
            (data.errors).forEach((error: { path: string; msg: string; }) => { // Recorre los errores
                console.log(error);
            })
        }else{ // Si el servidor no devuelve errores:
            return data as variante[]
        }
    })
    .catch(error => { // Si hay un error se manejan 
        mostrarMensaje('2',true);
        console.error(error);
        return undefined
    })
}

export const actualizarVariantes = async(variantes:variante[],productoId:ObjectId):Promise<undefined|error[]>=>{

    return fetch(urlVariantes+`/${productoId}`, { 
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
            'tokenAcceso' : `${tokenAcceso}` },
        body: JSON.stringify({variantes})
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
        if(data.errors){ // Si el servidor devuelve errores los muestra segun corresponda
            mostrarMensaje('',true);
            (data.errors).forEach((error:error) => { // Recorre los errores
                console.log(error);
            })
            return data.errors
        }else{ // Si el servidor no devuelve errores:
            mostrarMensaje('Variantes actualizadas con exito')
            return undefined
        }
    })
    .catch(error => { // Si hay un error se manejan 
        mostrarMensaje('2',true);
        console.error(error);
        return undefined
    })
}