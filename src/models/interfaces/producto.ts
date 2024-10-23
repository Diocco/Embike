import mongoose, { ObjectId } from "mongoose"

export interface producto {
    _id:string
    nombre:string,
    marca:string,
    modelo:string,
    estado:boolean,
    usuario:mongoose.Schema.Types.ObjectId, 
    categoria:mongoose.Schema.Types.ObjectId,
    variantes: [
        {
            color:string,
            caracteristicas: [
                {
                    talle: string,
                    SKU: string,
                    stock: number,
                    imagenes: [string],
                }]
        }
    ],
    descripcion: string
    precio:number,
    precioViejo:number,
    especificaciones:mongoose.Schema.Types.Mixed
    disponible:boolean,
    tags:[string],
    save: () => Promise<void>
    }
