"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.eliminarUsuario = exports.verUsuarios = exports.actualizarUsuario = exports.agregarUsuario = void 0;
const bcryptjs_1 = __importStar(require("bcryptjs"));
const usuario_1 = __importDefault(require("../models/usuario"));
const agregarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Desestructura la informacion entrante para usar solo lo que se requiera
    const { nombre, password, correo, rol } = req.body;
    // Crea una nueva entrada con el modelo "Usuario"
    const usuario = new usuario_1.default({ nombre, password, correo, rol }); // A la entrada le agrega la informacion que viene en el body
    // Encriptar contraseña
    const salt = bcryptjs_1.default.genSaltSync(); // Genera un "salt" para indicar el nivel de encriptacion
    usuario.password = (0, bcryptjs_1.hashSync)(password, salt); // Genera un hash relacionado a la contraseña del usuario
    yield usuario.save(); // Guarda el modelo en la base de datos
    res.status(201).json({
        msg: "Usuario guardado en la base de datos",
        usuario
    });
});
exports.agregarUsuario = agregarUsuario;
const actualizarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { nombre, activo, google, _id, __v, password } = _a, resto = __rest(_a, ["nombre", "activo", "google", "_id", "__v", "password"]); // Deja en "resto" las propiedades que son modificables
    if (password) { // Si se mando una contraseña:
        // Encriptar contraseña
        const salt = bcryptjs_1.default.genSaltSync(); // Genera un "salt" para indicar el nivel de encriptacion
        resto.password = (0, bcryptjs_1.hashSync)(password, salt); // Genera un hash relacionado a la contraseña del usuario y la agrega al resto de propiedades
    }
    // Busca por id en la base de datos que actualiza las propiedades que esten en "resto". { new: true } devuelve el documento actualizado
    const usuario = yield usuario_1.default.findByIdAndUpdate(id, resto, { new: true });
    res.status(200).json({
        msg: "Usuario actualizado en la base de datos",
        usuario
    });
});
exports.actualizarUsuario = actualizarUsuario;
const verUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Math.abs(Number(req.query.desde)) || 0; // Valor por defecto 0 si no se pasa el parámetro o es invalido
    const cantidad = Math.abs(Number(req.query.cantidad)) || 10; // Valor por defecto 10 si no se pasa el parámetro o es invalido
    const condicion = { activo: true }; // Condicion que debe cumplir la busqueda de usuarios
    // Crea un array de promesas que no son independientes entre ellas para procesarlas en paralelo
    const [usuarios, usuariosCantidad] = yield Promise.all([
        usuario_1.default.find(condicion) // Busca a todos los usuarios en la base de datos que cumplen la condicion
            .skip(desde).limit(cantidad),
        usuario_1.default.countDocuments(condicion) // Devuelve la cantidad de objetos que hay que cumplen con la condicion
    ]);
    // Indica la cantidad de paginas que se necesitan para mostrar todos los resultados
    const paginasCantidad = Math.ceil(usuariosCantidad / cantidad);
    res.status(200).json({
        usuariosCantidad,
        paginasCantidad,
        usuarios
    });
});
exports.verUsuarios = verUsuarios;
const eliminarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Desestructura el id
    // Busca el usuario con ese id y cambia su estado de actividad
    const usuario = yield usuario_1.default.findByIdAndUpdate(id, { activo: false }, { new: true });
    res.status(200).json({
        usuario
    });
});
exports.eliminarUsuario = eliminarUsuario;
