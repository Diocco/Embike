import mongoose from "mongoose";
import { variante } from "./variante.js";

export interface RegistroVentaI{
    _id?:mongoose.Schema.Types.ObjectId,
    lugarVenta?:string
    fechaVenta:Date
    total:number
    metodo1:string
    metodo2?:string
    pago1?:number
    pago2?:number
    descuentoNombre?:string
    descuento?:number
    promocion?:mongoose.Schema.Types.ObjectId,
    observacion?:string
    cliente?:mongoose.Schema.Types.ObjectId,
    carrito?:[
        string[],
        number[],
        number[],
        string[]
    ]
    vendedor?:string
    estado:string,
    modificaciones?:[{
        fecha:Date,
        vendedor:string,
        modificaciones:string[]
    }]
}