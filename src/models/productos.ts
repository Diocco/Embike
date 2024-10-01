import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({ // Crea el esquema para el producto
    nombre:{ 
        type: String,
        required: [true, "El nombre es obligatorio"] //Mensaje de error personalizado
    },
    estado:{ 
        type: Boolean,
        default:true,
        required: true 
    },
    usuario:{ // Se almacena el usuario que lo creo
        type: mongoose.Schema.Types.ObjectId, // Se especifica que se va a usar un schema como tipo
        ref: 'Usuario' // Se especifica el Schema particular que se va a almacenar
    },
    categoria:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    descripcion:{
        type: String
    },
    SKU:{ // Codigo de barra
        type: String,
        default: "0"
    },
    precio:{
        type: Number,
        default: 0
    },
    caracteristicas:{
        type: [mongoose.Schema.Types.Mixed],
    },
    color:{
        type: String,
        default: "#000000",
        require: true
    },
    stock:{
        type: Number,
        default: 0,
        require: true
    },
    disponible:{
        type: Boolean,
        default: false,
        require: true
    },
    imagenes:{
        type: [String],
        require: true
    },
    tags:{
        type: [String]
    }
})

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;