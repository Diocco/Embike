import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';

export interface categoria {
    _id:ObjectId
    nombre:string,
    estado:boolean,
    usuario:mongoose.Schema.Types.ObjectId, 
    }
