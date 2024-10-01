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
exports.SKUUnico = exports.productoExiste = void 0;
const productos_1 = __importDefault(require("../src/models/productos"));
// Verifica que el producto exista
const productoExiste = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const productoDB = yield productos_1.default.findById(id); // Verifica si en la base de datos haya un objeto que tenga el id pasado como argumento
    if (!productoDB) { // Si el producto no existe entonces:
        throw new Error(`El producto con id: ${id}, no existe`);
    }
    else if (!productoDB.estado) { // Si el producto existe pero no tiene estado activo entonces:
        throw new Error(`El producto con id: ${id}, no esta activado`);
    }
});
exports.productoExiste = productoExiste;
// Verifica que el SKU sea unico 
const SKUUnico = (SKU) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(SKU === "0")) { // Si el SKU es "0" entonces no realiza la verificacion
        const existe = yield productos_1.default.findOne({ SKU }); // Verifica si en la base de datos haya un objeto que tenga una SKU "parametro" con el mismo valor pasado como argumento en el body
        if (existe) { // Si el SKU es encontrado entonces:
            throw new Error(`El SKU ingresado ya esta registrado`);
        }
        ;
    }
});
exports.SKUUnico = SKUUnico;
