"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productoSchema = new mongoose_1.default.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"] //Mensaje de error personalizado
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: mongoose_1.default.Schema.Types.ObjectId, // Se especifica que se va a usar un schema como tipo
        ref: 'Usuario' // Se especifica el Schema particular que se va a almacenar
    },
    categoria: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    descripcion: {
        type: String
    },
    SKU: {
        type: String,
        default: "0"
    },
    precio: {
        type: Number,
        default: 0
    },
    caracteristicas: {
        type: [mongoose_1.default.Schema.Types.Mixed],
    },
    color: {
        type: String,
        default: "#000000",
        require: true
    },
    stock: {
        type: Number,
        default: 0,
        require: true
    },
    disponible: {
        type: Boolean,
        default: false,
        require: true
    },
    imagenes: {
        type: [String],
        require: true
    },
    tags: {
        type: [String]
    }
});
const Producto = mongoose_1.default.model('Producto', productoSchema);
exports.default = Producto;
