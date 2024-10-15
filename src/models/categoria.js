import mongoose from 'mongoose';
const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"] //Mensaje de error personalizado
    },
    estado: {
        type: Boolean,
        default: true,
        required: true //Mensaje de error personalizado
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId, // Se especifica que se va a usar un schema como tipo
        ref: 'Usuario' // Se especifica el Schema particular que se va a almacenar
    }
});
const Categoria = mongoose.model('Categoria', categoriaSchema);
export default Categoria;
