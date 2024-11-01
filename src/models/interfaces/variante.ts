import mongoose, { ObjectId } from "mongoose";

export interface variante {
    _id?: ObjectId|string, 
    producto: ObjectId, 
    color: string,
    talle: string,
    SKU: string,
    stock: number,
    }
