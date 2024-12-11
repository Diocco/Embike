import { error } from "../interfaces/error";
import { Request, Response } from 'express';
import MetodoPago from "../models/metodosPago.js";
import { usuario } from "../models/interfaces/usuario.js";
import { MetodoPagoI } from "../models/interfaces/metodosPago.js";

export const verMetodosPago = async(req: Request, res: Response) =>{

    try{
        const metodosPago = await MetodoPago.find()  // Busca todos los metodos de pago

        res.status(200).json({metodosPago})

    } catch (error) {
        const errors:error[]=[{
            msg: "Error al ver los productos",
            path: "Servidor",
            value: (error as Error).message
        }]
        console.log(error)
        return res.status(500).json(errors)
    }
}

export const crearMetodoPago = async(req: Request, res: Response) =>{
    // Desestructura la informacion del body para utilizar solo la informacion requerida
    // Previamente se verifico la existencia de los elementos obligatorios y el formato correcto de la totalidad de los elementos
    const { nombre,tipo } = req.body

    const usuario:usuario = req.body.usuario
    
    let data:MetodoPagoI={ // Estructura la informacion obligatoria para realizar la solicitud
        nombre,
        tipo,
        estado:true
    }

    try{

        const metodoPago = new MetodoPago( data ) // Crea una nuevo registro de venta
        await metodoPago.save() // La guarda en la base de datos
        res.json(metodoPago)

    } catch (error) {
        const errors:error[]=[{
            msg: "Error al crear el metodo de pago",
            path: "Servidor",
            value: (error as Error).message
        }]
        console.log(error)
        return res.status(500).json(errors)
    }
}