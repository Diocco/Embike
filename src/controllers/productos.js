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
exports.eliminarProducto = exports.actualizarProducto = exports.crearProducto = exports.verProductoID = exports.verProductos = void 0;
const productos_1 = __importDefault(require("../models/productos"));
// Devuelve todas las productos
const verProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Math.abs(Number(req.query.desde)) || 0; // Valor por defecto 0 si no se pasa el parámetro o es invalido
    const cantidad = Math.abs(Number(req.query.cantidad)) || 10; // Valor por defecto 10 si no se pasa el parámetro o es invalido
    const condicion = { estado: true }; // Condicion/es que debe cumplir la busqueda
    // Crea un array de promesas que no son independientes entre ellas para procesarlas en paralelo
    const [productos, productosCantidad] = yield Promise.all([
        productos_1.default.find(condicion) // Busca a todos los productos en la base de datos que cumplen la condicion
            .skip(desde).limit(cantidad),
        productos_1.default.countDocuments(condicion) // Devuelve la cantidad de objetos que hay que cumplen con la condicion
    ]);
    // Indica la cantidad de paginas que se necesitan para mostrar todos los resultados
    const paginasCantidad = Math.ceil(productosCantidad / cantidad);
    res.status(200).json({
        productosCantidad,
        paginasCantidad,
        productos
    });
});
exports.verProductos = verProductos;
// Devuelve la producto con el id pasado como parametro
const verProductoID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const producto = yield productos_1.default.findById(id);
    res.status(200).json(producto);
});
exports.verProductoID = verProductoID;
// Crea una nueva producto
const crearProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, categoria, descripcion, SKU, precio, caracteristicas, color, stock, disponible, imagenes, tags } = req.body;
    const usuario = req.body.usuario;
    const data = {
        nombre,
        usuario,
        categoria,
        descripcion,
        SKU,
        precio,
        caracteristicas,
        color,
        stock,
        disponible,
        imagenes,
        tags
    };
    const producto = new productos_1.default(data); // Crea una nueva producto
    yield producto.save(); // La guarda en la base de datos
    res.json(`Se creo la producto ${nombre}`);
});
exports.crearProducto = crearProducto;
// Actualiza una producto con el id pasado como parametro
const actualizarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, categoria, descripcion, SKU, precio, caracteristicas, color, stock, disponible, imagenes, tags } = req.body; // Extrae el parametro que sea modificable
    // Busca por id en la base de datos que actualiza las propiedades que esten en el segundo parametro. { new: true } devuelve el documento actualizado
    const productoActualizado = yield productos_1.default.findByIdAndUpdate(id, { nombre, categoria, descripcion, SKU, precio, caracteristicas, color, stock, disponible, imagenes, tags }, { new: true });
    res.status(200).json({
        msg: "Producto actualizado en la base de datos",
        productoActualizado
    });
});
exports.actualizarProducto = actualizarProducto;
// Elimina un producto con el id pasado como parametro
const eliminarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Desestructura el id
    // Busca la producto con ese id y cambia su estado de actividad
    const productoEliminado = yield productos_1.default.findByIdAndUpdate(id, { estado: false }, { new: true });
    const usuarioAutenticado = req.body.producto;
    res.status(200).json({
        productoEliminado,
        usuarioAutenticado
    });
});
exports.eliminarProducto = eliminarProducto;
