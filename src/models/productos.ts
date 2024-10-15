import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    nombre:{ 
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    marca: {
        type: String,
        required: [true, "La marca es obligatoria"]
    },
    modelo: {
        type: String,
        required: [true, "El modelo es obligatorio"]
    },
    estado:{ 
        type: Boolean,
        default: true,
        required: true 
    },
    usuario:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario' 
    },
    categoria:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    variantes: [
        {
            color: {
                type: String,
                default: '#000000',
                required: true // Color es obligatorio
            },
            caracteristicas: [
                {
                    talle: {
                        type: String,
                        required: true // Talle es obligatorio
                    },
                    SKU: { 
                        type: String,
                        default: "0"
                    },
                    stock: {
                        type: Number,
                        default: 0,
                        required: true
                    },
                    imagenes: {
                        type: [String],
                        default:'../img/icons/icono-sinFoto.avif' ,
                        required: true
                    }
                }]
        }
    ],
    descripcion:{
        type: String
    },
    precio:{
        type: Number,
        default: 0
    },
    precioViejo:{
        type: Number,
        default: 0
    },
    especificaciones: {
        type: mongoose.Schema.Types.Mixed // Permite características dinámicas
    },
    disponible:{
        type: Boolean,
        default: true,
        required: true
    },
    tags:{
        type: [String]
    }
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;