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
exports.categoriaExiste = void 0;
const categoria_1 = __importDefault(require("../src/models/categoria"));
// Verifica si la categoria existe mediante su id
const categoriaExiste = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existe = yield categoria_1.default.findById(id); // Verifica si en la base de datos haya un objeto que tenga el id pasado como argumento
        if (!existe) { // Si la categoria no existe entonces:
            throw new Error(`La categoria con id: ${id}, no existe`);
        }
        ;
    }
    catch (error) { // Si el id no es valido entonces:
        throw new Error(`El id: ${id}, no es valido`);
    }
});
exports.categoriaExiste = categoriaExiste;
