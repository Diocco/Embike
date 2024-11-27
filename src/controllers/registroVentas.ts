import { Request, Response } from 'express';
import { usuario } from '../models/interfaces/usuario.js';
import { RegistroVentaI } from '../models/interfaces/registroVentas.js';
import VentaRegistro from '../models/registroVenta.js';
import { error } from '../interfaces/error.js';
import mongoose from 'mongoose';

export const registrarVenta = async(req: Request, res: Response) =>{
    // Desestructura la informacion del body para utilizar solo la informacion requerida
    // Previamente se verifico la existencia de los elementos obligatorios y el formato correcto de la totalidad de los elementos
    const { lugarVenta, 
        fechaVenta,
        total,
        metodo,
        descuento,
        promocion,
        observacion,
        cliente,
        carrito,
        vendedor,
        estado,
        modificaciones
    } = req.body

    const usuario:usuario = req.body.usuario
    
    let data:RegistroVentaI={ // Estructura la informacion obligatoria para realizar la solicitud
        fechaVenta,
        total,
        metodo,
        estado
    }

    try{
        // Verifica la informacion opcional, si existe la agrega a la informacion de la solicitud
        if(lugarVenta) data.lugarVenta=lugarVenta
        if(descuento) data.descuento=descuento
        if(promocion) data.promocion=promocion
        if(observacion) data.observacion=observacion
        if(cliente) data.cliente=cliente
        if(carrito) data.carrito=carrito
        if(vendedor) data.vendedor=vendedor
        if(modificaciones) data.modificaciones=modificaciones

        const registroVenta = new VentaRegistro( data ) // Crea una nuevo registro de venta
        await registroVenta.save() // La guarda en la base de datos
        
        res.json(registroVenta)
    } catch (error) {
        const errors:error[]=[{
            msg: "Error al crear el registro de la venta",
            path: "Servidor",
            value: (error as Error).message
        }]
        console.log(error)
        return res.status(500).json(errors)
    }
}

export const verRegistroVentas = async(req: Request, res: Response)=>{

    // Si se envian queryparams entonces se buscan todos los productos filtrados por los parametros recibidos
    const desde:number = Math.abs(Number(req.query.desde)) || 0;  // Valor por defecto 0 si no se pasa el parámetro o es invalido
    const hasta:number = Math.abs(Number(req.query.hasta)) || 20;  // Valor por defecto 20 para mostrar los elementos en varias paginas
    const pagina:number = Math.abs(Number(req.query.pagina)) || 1;  // Valor que indica la pagina de los resultados
    let IDVenta:string = req.query.IDVenta as string || '';  // Valor de busqueda de un id de venta especifico
    const metodo:string = req.query.metodo as string || '' // Valor que filtra por metodo de pago
    const estado:string = req.query.estado as string || '' // Valor que filtra por estado de venta
    let buscarObservacion:string = req.query.buscarObservacion as string || ''; // Palabra buscada dentro de las observaciones
    try{

        
        let filtros: any = {}
        
        // Agrega los filtros que se hayan enviado
        if(buscarObservacion) filtros.$or = [{observacion: new RegExp(buscarObservacion, 'i')}]
        if(estado) filtros.$and = [{ estado: estado }]
        if(IDVenta){
            // Se envio un ID para buscar en la base de datos
            if(mongoose.Types.ObjectId.isValid(IDVenta)) filtros.$or = [{ _id: IDVenta }] // Verifica que el ID sea valido, si lo es lo agrega a los parametros de busqueda
            else filtros.$or = [{ _id: "000000000000000000000000" }] // Si el ID no es valido entonces en los parametros de busqueda coloca un ID valido pero que no existe, para reflejar la invalidez del ID enviado
        } 
        if(metodo) filtros.$and = [{ metodo: metodo }]

        // Crea un array de promesas que no son independientes entre ellas para procesarlas en paralelo
        const [registroVentas, registroVentasCantidad]:[RegistroVentaI[],number] = await Promise.all([ // Una vez que se cumplen todas se devuelve un array con sus resultados
            VentaRegistro.find(filtros)  // Busca a todos los productos en la base de datos que cumplen la condiciones
                .skip(desde+((pagina-1)*hasta)).limit(hasta),
            VentaRegistro.countDocuments(filtros) // Devuelve la cantidad de objetos que hay que cumplen con la condiciones
        ])

        // Indica la cantidad de paginas que se necesitan para mostrar todos los resultados
        const paginasCantidad:number = Math.ceil(registroVentasCantidad/hasta); 

        res.status(200).json({
            registroVentas,
            registroVentasCantidad,
            paginasCantidad
        })
    } catch (error) {
        const errors:error[]=[{
            msg: "Error al ver los productos",
            path: "Servidor",
            value: (error as Error).message
        }]
        console.log(error)
        return res.status(500).json(errors)
    }
}