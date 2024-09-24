"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const usuarioSchema = new mongoose_1.default.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"], //Mensaje de error personalizado
        trim: true
    },
    correo: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    rol: {
        type: String,
        required: true,
        enum: ['admin', 'usuario'],
        default: 'usuario'
    },
    img: {
        type: String,
    },
    activo: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
// Cuando se llama a "usuarioSchema" dentro de un "toJSON" se ejecuta la siguiente funcion:
usuarioSchema.methods.toJSON = function () {
    // Convierte el documento Mongoose a un objeto de JavaScript.
    const _a = this.toObject(), { __v, password } = _a, usuario = __rest(_a, ["__v", "password"]);
    // Retorna el objeto 'usuario' sin las propiedades 'password' y '__v'.
    return usuario;
};
const Usuario = mongoose_1.default.model('Usuario', usuarioSchema);
exports.default = Usuario;
