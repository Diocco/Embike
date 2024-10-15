import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nombre:{ //Se puede estructurar de esta forma para que sea mas legible
        type: String,
        required: [true, "El nombre es obligatorio"], //Mensaje de error personalizado
        trim: true 
    },
    correo: { //Correo del usuario
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true
    },
    password:{ 
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    listaDeseados:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Producto'
    },
    rol: { 
        type: String, 
        required: true,
        enum: ['admin', 'usuario'], 
        default: 'usuario' },
    img: { // Imagen de perfil
        type: String,
    },
    activo: { // Si se encuentra activo
        type: Boolean, 
        default: true 
    },
    google:{ // Indica si los datos del usuario se obtuvieron mediante google
        type: Boolean,
        default: false
    }

}, { timestamps: true });

// Cuando se llama a "usuarioSchema" dentro de un "toJSON" se ejecuta la siguiente funcion:
usuarioSchema.methods.toJSON = function() {
    // Convierte el documento Mongoose a un objeto de JavaScript.
    const { __v, password, _id,...usuario } = this.toObject();
    usuario.uid = _id; // Cambio visual del id
    
    // Retorna el objeto 'usuario' sin las propiedades 'password' y '__v'.
    return usuario;
}


const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;