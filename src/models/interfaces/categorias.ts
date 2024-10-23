import mongoose from 'mongoose';

export interface categoria {
    nombre:string,
    estado:boolean,
    usuario:mongoose.Schema.Types.ObjectId, 
    }
