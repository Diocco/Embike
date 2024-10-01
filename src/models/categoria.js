"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categoriaSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId, // Se especifica que se va a usar un schema como tipo
        ref: 'Usuario' // Se especifica el Schema particular que se va a almacenar
    }
});
const Categoria = mongoose_1.default.model('Categoria', categoriaSchema);
exports.default = Categoria;
