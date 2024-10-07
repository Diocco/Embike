"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarCategoria = exports.actualizarCategoria = exports.crearCategoria = exports.verCategoriaID = exports.verCategorias = void 0;
const categoria_1 = __importDefault(require("../models/categoria"));
// Devuelve todas las categorias
const verCategorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Math.abs(Number(req.query.desde)) || 0; // Valor por defecto 0 si no se pasa el parámetro o es invalido
    const cantidad = Math.abs(Number(req.query.cantidad)) || 10; // Valor por defecto 10 si no se pasa el parámetro o es invalido
    const nombres = req.query.nombres || null;
    const condicion = { estado: true }; // Condicion/es que debe cumplir la busqueda
    // Crea un array de promesas que no son independientes entre ellas para procesarlas en paralelo
    let [categorias, categoriasCantidad] = yield Promise.all([
        categoria_1.default.find(condicion).populate('usuario') // Busca a todos los categorias en la base de datos que cumplen la condicion
            .skip(desde).limit(cantidad),
        categoria_1.default.countDocuments(condicion) // Devuelve la cantidad de objetos que hay que cumplen con la condicion
    ]);
    // Indica la cantidad de paginas que se necesitan para mostrar todos los resultados
    const paginasCantidad = Math.ceil(categoriasCantidad / cantidad);
    if (nombres) { // Si nombres es "true" entonces devuelve la solicitud solo un array con los nombres de las categorias
        categorias = categorias.map(categoria => categoria.nombre);
    }
    res.status(200).json({
        categoriasCantidad,
        paginasCantidad,
        categorias
    });
});
exports.verCategorias = verCategorias;
// Devuelve la categoria con el id pasado como parametro
const verCategoriaID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const condicion = { estado: true }; // Condicion/es que debe cumplir la busqueda de la categoria
    const categoria = yield categoria_1.default.findById(id, condicion).populate('usuario');
    res.status(200).json(categoria);
});
exports.verCategoriaID = verCategoriaID;
// Crea una nueva categoria
const crearCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nombre = req.body.nombre;
    const usuario = req.body.usuario;
    // Verifica que el nombre sea unico
    const categoriaDB = yield categoria_1.default.findOne({ nombre });
    if (categoriaDB) { // Si la categoria se encontro en la base de datos:
        return res.status(400).json({
            errors: [{
                    msg: "La categoria ya existe",
                    path: "nombre"
                }]
        });
    }
    // Si paso todas las verificaciones entonces:
    const data = {
        nombre,
        usuario
    };
    const categoria = new categoria_1.default(data); // Crea una nueva categoria
    yield categoria.save(); // La guarda en la base de datos
    res.json(`Se creo la categoria ${nombre}`);
});
exports.crearCategoria = crearCategoria;
// Actualiza una categoria con el id pasado como parametro
const actualizarCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre } = req.body; // Extrae el parametro que sea modificable
    // Busca por id en la base de datos que actualiza las propiedades que esten en el segundo parametro. { new: true } devuelve el documento actualizado
    const categoriaActualizada = yield categoria_1.default.findByIdAndUpdate(id, { nombre }, { new: true });
    res.status(200).json({
        msg: "Categoria actualizada en la base de datos",
        categoriaActualizada
    });
});
exports.actualizarCategoria = actualizarCategoria;
// Elimina una categoria con el id pasado como parametro
const eliminarCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Desestructura el id
    // Busca la categoria con ese id y cambia su estado de actividad
    const categoriaEliminada = yield categoria_1.default.findByIdAndUpdate(id, { estado: false }, { new: true });
    const usuarioAutenticado = req.body.usuario;
    res.status(200).json({
        categoriaEliminada,
        usuarioAutenticado
    });
});
exports.eliminarCategoria = eliminarCategoria;
