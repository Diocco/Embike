import { ObjectId } from "mongoose"
import { Request, Response } from 'express';
import { variante } from "../models/interfaces/variante.js";
import Variante from '../models/variante.js';
import { error } from "../interfaces/error.js";
import { SKUUnico } from '../../database/variantesVerificaciones.js';
import Producto from "../models/productos.js";






// Crea una nueva variante de un producto
export const crearVariante = async(req: Request, res: Response)=>{
    const { 
        SKU,
        producto,
        color,
        talle,
        stock
    } = req.body

    const data:variante={
        SKU,
        producto,
        color,
        talle,
        stock
    }

    const varianteDB = new Variante( data ) // Crea una nueva producto
    await varianteDB.save() // La guarda en la base de datos
    
    res.json(varianteDB)
}

export const verVariantes = async(req: Request, res: Response)=>{
    const { productoId } = req.params 

    const variantes:variante[] = await Variante.find( {producto:productoId} )

    res.json(variantes)
}

export const actualizarVariantes = async (req: Request, res: Response) => {
    const { productoId } = req.params
    const { variantes }:{
        variantes: variante[]
    } = req.body; 

    let errors: error[] = []; // Inicia una variable que contendra un array de errores de tipeo, se los hay
    
    try {

        // Verifica que ninguna variante tenga errores y almacena sus ID
        let variantesId:string[]=[]
        for (const variante of variantes) { // Recorre las variantes

            variantesId.push(variante._id! as string) // Almacena el ID de la variante

            try { // Verifica si el stock es valido
                if (isNaN(Number(variante.stock))) throw new Error("El stock no es válido");
            } catch (error) {
                errors.push({
                    msg: (error as Error).message,
                    value: variante.stock,
                    path: 'stock'
                });
            }

            try { // Verifica si el SKU es unico
                await SKUUnico(variante.SKU,variante._id as string); // Asegura que SKUUnico se complete antes de continuar
            } catch (error) {
                errors.push({
                    msg: (error as Error).message,
                    value: variante._id!.toString(),
                    path: 'SKU'
                });
            }
        }

        // Si hay errores, devuelve la lista de errores
        if (errors.length > 0) return res.status(400).json({ errors });

        // Si no hay errores guarda las variantes en la base de datos

        await Promise.all([
            variantes.map(async variante => {// Crea un array de promesas para actualizar la base de datos en paralelo
                await Variante.findByIdAndUpdate(variante._id, variante);
    }),
            Producto.findByIdAndUpdate(productoId,{'variantes':variantesId}) // Actualiza el array de objectId de las variantes dentro del producto
        ]);



        // Devuelve el estado de éxito
        return res.status(200).json({ message: "Variantes actualizadas exitosamente" });

    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar variantes" });
    }
};