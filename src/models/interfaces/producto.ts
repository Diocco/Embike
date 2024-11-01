import mongoose from "mongoose"
import { categoria } from "./categorias"
import { variante } from "./variante"

export interface producto {
    _id:mongoose.Schema.Types.ObjectId,
    nombre:string,
    marca:string,
    modelo:string,
    estado:boolean,
    usuario:mongoose.Schema.Types.ObjectId, 
    categoria:mongoose.Schema.Types.ObjectId|categoria,
    variantes: mongoose.Schema.Types.ObjectId|variante[],
    descripcion: string
    precio:number,
    precioViejo:number,
    especificaciones:mongoose.Schema.Types.Mixed
    disponible:boolean,
    tags:[string],
    imagenes: string[],
    save: () => Promise<void>
    }
