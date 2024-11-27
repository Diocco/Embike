import mongoose from "mongoose"
import { RegistroVentaI } from "../../../models/interfaces/registroVentas.js"
import { mostrarErroresConsola, tokenAcceso, urlRegistroVentas } from "../global.js"
import { mostrarMensaje } from "../helpers/mostrarMensaje.js"
import { variante } from "../../../models/interfaces/variante.js"

export const registrarVenta = async(
    total:number,
    metodo:string,
    estado:string,
    lugarVenta?:string,
    descuento?:number,
    observacion?:string,
    carrito?:[
        string[],
        number[],
        number[],
        string[]
    ]
):Promise<RegistroVentaI | undefined>=>{

    // Estructura la informacion y le da formato de string
    const fechaVenta = new Date()
    const data = JSON.stringify({
        fechaVenta,
        total,
        metodo,
        estado,
        lugarVenta,
        descuento,
        observacion,
        carrito
    })

    let registroVenta:RegistroVentaI|undefined = undefined

    await fetch(urlRegistroVentas, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            'tokenAcceso':`${tokenAcceso}`},
        body: data
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Maneja la respuesta del servidor
        if(data.errors) mostrarErroresConsola (data.errors) // Si hay errores de tipeo los muestra en consola 
        else registroVenta = data // Si el servidor no devuelve errores guarda la respuesta
    })
    .catch(error => { // Si hay un error se manejan 
        console.error(error);
        mostrarMensaje('2',true);
    })

    return registroVenta
}

export const verRegistroVentas =async(desde:string='',hasta:string='',pagina:string='',IDVenta:string='',metodo:string='',estado:string='',buscarObservacion:string='')=>{

    let respuesta:{
        registroVentas:RegistroVentaI[],
        registroVentasCantidad:number,
        paginasCantidad:number
    }={
        registroVentas:[],
        registroVentasCantidad:0,
        paginasCantidad:0
    }




    await fetch(urlRegistroVentas+`?desde=${desde}&hasta=${hasta}&pagina=${pagina}&IDVenta=${IDVenta}&metodo=${metodo}&estado=${estado}&buscarObservacion=${buscarObservacion}`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data=> { // Maneja la respuesta del servidor
        if(data.errors) mostrarErroresConsola (data.errors) // Si hay errores de tipeo los muestra en consola 
        else { // Si no hay errores entonces almacena la respuesta del servidor
            respuesta = data 
        }
    })
    .catch(error => { // Si hay un error se manejan y se muestra en consola
        mostrarMensaje('2',true);
        console.error(error);
    })

    return respuesta
}