import mongoose, { Model } from "mongoose";
import { RegistroVentaI } from './interfaces/registroVentas.js';

const ventaSchema = new mongoose.Schema<RegistroVentaI>({
    lugarVenta:{ 
        type: String,
    },
    fechaVenta: {
        type: Date,
        default:Date.now(),
        required: [true, "La fecha de la venta es obligatoria"]
    },
    total: {
        type: Number,
        required: [true, "El total de la venta es obligatorio"]
    },
    metodo:{ 
        type: String,
        required: [true, "El metodo de pago es obligatorio"]
    },
    descuento:{ 
        type: Number,
    },
    promocion:{
        type: mongoose.Schema.Types.ObjectId,
    },
    observacion: { 
        type: String
    },
    cliente:{
        type: mongoose.Schema.Types.ObjectId,
    },
    carrito:{
        type:[
            [String],
            [Number],
            [Number],
            [String]
        ]
    },
    vendedor: { 
        type: String
    },
    estado: { 
        type: String,
        default:'Completado'
    },
    modificaciones:[{
        fecha:{
            type: Date
        },
        vendedor:{
            type: String
        },
        modificaciones:{
            type: [String]
        },
    }],
});

const VentaRegistro:Model<RegistroVentaI> = mongoose.model<RegistroVentaI>('VentaRegistro', ventaSchema);

export default VentaRegistro;