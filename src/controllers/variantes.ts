import { ObjectId } from "mongoose"
import { Request, Response } from 'express';
import { variante } from "../models/interfaces/variante.js";
import Variante from '../models/variante.js';
import { error } from "../interfaces/error.js";
import { SKUUnico } from '../../database/variantesVerificaciones.js';
import Producto from "../models/productos.js";
import { producto } from "../models/interfaces/producto.js";






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
        'stock':Number(stock)
    }
    try {
    
        const varianteDB = new Variante( data ) // Crea una nueva variante
        await Promise.all([
            agregarVarianteProducto(producto,varianteDB._id as ObjectId),
            varianteDB.save() // La guarda en la base de datos
        ])

        res.json(varianteDB)
    } catch (error) {
        const errors:error[]=[{
            msg: "Error al crear una nueva variante",
            path: "Servidor",
            value: (error as Error).message
        }]
        console.log(error)
        return res.status(500).json(errors)
    }

    

}

export const verVariantes = async(req: Request, res: Response)=>{
    const { productoId } = req.params 

    try{
        const variantes:variante[] = await Variante.find( {producto:productoId} )

        res.json(variantes)
    } catch (error) {
        const errors:error[]=[{
            msg: "Error al ver las variantes",
            path: "Servidor",
            value: (error as Error).message
        }]
        console.log(error)
        return res.status(500).json(errors)
    }
}

export const actualizarVariantes = async (req: Request, res: Response) => {
    const { productoId } = req.params
    const { variantes }:{
        variantes: variante[]
    } = req.body; 

    let errors: error[] = []; // Inicia una variable que contendra un array de errores de tipeo, se los hay
    
    try {
        // Verifica que ninguna variante tenga errores y almacena sus ID
        for (let variante of variantes) { // Recorre las variantes

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
                if(!variante.SKU) throw new Error("El SKU es obligatorio");
                await SKUUnico(variante.SKU,variante._id as string); // Asegura que SKUUnico se complete antes de continuar
            } catch (error) {
                errors.push({
                    msg: (error as Error).message,
                    value: variante.SKU,
                    path: 'SKU'
                });
            }
        }

        // Si hay errores, devuelve la lista de errores
        if (errors.length > 0) return res.status(400).json({ errors });

        // Si no hay errores guarda las variantes en la base de datos
        await Promise.all(
            // Crea un array de promesas para actualizar la base de datos en paralelo
            variantes.map(async variante => { 
                if(variante._id) {
                    await Variante.findByIdAndUpdate(variante._id, variante); // Si el id existe entonces actualiza la variante
                }

                else { // Si el id no existe entonces crea la variante 
                    const {_id, ...data} = variante // Quita el id vacio
                    const varianteDB = new Variante( data )
                    await varianteDB.save()
                    variante._id=varianteDB._id // Le asigna el id
                }
            })
        );

        const variantesId:string[] = variantes.map(variante => variante._id!.toString())
        await Producto.findByIdAndUpdate(productoId,{'variantes':variantesId})

        // Devuelve el estado de éxito
        return res.status(200).json({ message: "Variantes actualizadas exitosamente" });

    } catch (error) {
        const errors:error[]=[{
            msg: "Error al actualizar las variantes",
            path: "Servidor",
            value: (error as Error).message
        }]
        console.log(error)
        return res.status(500).json(errors)
    }
};

const agregarVarianteProducto=async(productoId:string|ObjectId,varianteId:ObjectId)=>{


    const producto:producto|null = await Producto.findById(productoId);
    if(!producto) throw new Error("No se encontro el producto para agregar la variante");
    
    (producto.variantes as ObjectId[]).push(varianteId);
    await producto.save();
    

}

export const eliminarVariante = async(req: Request, res: Response) =>{
    const {varianteId} = req.params; // Desestructura el id

    try{
        // Busca la variante con ese id y cambia su estado de actividad
        const variante = await Variante.findByIdAndDelete( varianteId ); 
        return res.status(200).json(variante)
    } catch (error) {
        const errors:error[]=[{
            msg: "Error al eliminar la variante",
            path: "Servidor",
            value: (error as Error).message
        }]
        console.log(error)
        return res.status(500).json(errors)
    }
}