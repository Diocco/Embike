import mongoose, { ObjectId } from "mongoose"
import { categoria } from "./categorias"

export interface producto {
    _id:string
    nombre:string,
    marca:string,
    modelo:string,
    estado:boolean,
    usuario:mongoose.Schema.Types.ObjectId, 
    categoria:mongoose.Schema.Types.ObjectId|categoria,
    variantes: variante[],
    descripcion: string
    precio:number,
    precioViejo:number,
    especificaciones:mongoose.Schema.Types.Mixed
    disponible:boolean,
    tags:[string],
    imagenes: string[],
    save: () => Promise<void>
    }

export interface variante {
    color:string,
    caracteristicas: [
        {
            talle: string,
            SKU: string,
            stock: number,
        }]
}
