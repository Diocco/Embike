var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Categoria from "../src/models/categoria.js";
// Verifica si la categoria existe mediante su id
const categoriaExiste = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existe = yield Categoria.findById(id); // Verifica si en la base de datos haya un objeto que tenga el id pasado como argumento
        if (!existe) { // Si la categoria no existe entonces:
            throw new Error(`La categoria con id: ${id}, no existe`);
        }
        ;
    }
    catch (error) { // Si el id no es valido entonces:
        throw new Error(`El id: ${id}, no es valido`);
    }
});
const categoriaValida = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoriaExiste = yield Categoria.findById(id); // Busca la categoria de entrada en la base de datos de categorias
        if (!categoriaExiste) { // Si la categoria no existe:
            throw new Error(`La categoria no es válida`); // Lanza un error dentro del check (el codigo sigue ejecutandose)
        }
    }
    catch (error) {
        throw new Error(`La categoria no tiene un formato valido`); // Lanza un error dentro del check (el codigo sigue ejecutandose)
    }
});
export { categoriaExiste, categoriaValida };
