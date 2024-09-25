import { ObjectId } from "mongoose"

export interface usuario {
        _id:ObjectId
        nombre:string
        correo:string
        password:string
        rol:string
        img:string
        activo:boolean
        google:boolean
        createAT:Date
        updateAT:Date
        __v:number
    }
