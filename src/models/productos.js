"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productoSchema = new mongoose_1.default.Schema({
    nombre: {
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
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    categoria: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
                        default: '../img/catalogoImagenes/icono-sinFoto.avif',
                        required: true
                    }
                }
            ]
        }
    ],
    descripcion: {
        type: String
    },
    precio: {
        type: Number,
        default: 0
    },
    especificaciones: {
        type: mongoose_1.default.Schema.Types.Mixed // Permite características dinámicas
    },
    disponible: {
        type: Boolean,
        default: true,
        required: true
    },
    tags: {
        type: [String]
    }
});
const Producto = mongoose_1.default.model('Producto', productoSchema);
exports.default = Producto;
