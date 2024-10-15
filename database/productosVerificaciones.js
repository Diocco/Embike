var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Producto from "../src/models/productos.js";
// Verifica que el producto exista
const productoExiste = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let productoDB; // Inicializa una variable que almacena el producto de la base de datos
    try {
        productoDB = yield Producto.findById(id); // Verifica si en la base de datos haya un objeto que tenga el id pasado como argumento
    }
    catch (error) {
        throw new Error(`Id no valido`);
    }
    if (!productoDB) { // Si el producto no existe entonces:
        throw new Error(`El producto con id: ${id}, no existe`);
    }
    else if (!productoDB.estado) { // Si el producto existe pero no tiene estado activo entonces:
        throw new Error(`El producto con id: ${id}, no esta activado`);
    }
});
// Verifica que el SKU sea unico 
const SKUUnico = (SKU) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(SKU === "0")) { // Si el SKU es "0" entonces no realiza la verificacion
        const existe = yield Producto.findOne({ 'variantes.caracteristicas.SKU': SKU }); // Verifica si en la base de datos haya un objeto que tenga una SKU "parametro" con el mismo valor pasado como argumento en el body
        if (existe) { // Si el SKU es encontrado entonces:
            throw new Error(`El SKU: ${SKU} ya esta registrado`);
        }
        ;
    }
});
const variantesValidas = (variantes) => __awaiter(void 0, void 0, void 0, function* () {
    // Verifica que los SKU recibidos sean unicos
    // Primero se crea un array para almacenar todos los SKU
    let listaSKUs = [];
    // Recorremos las variantes del producto
    for (const variante of variantes) { // Recorremos el array de las variantes de los colores del producto
        for (const caracteristica of variante.caracteristicas) { // Recorremos el array de las variantes de talles en cada color del producto
            // Verificar si el SKU ya existe en el array listaSKUs
            if (listaSKUs.includes(caracteristica.SKU)) {
                throw new Error("No se puede agregar dos productos con el mismo SKU");
            }
            // Si el SKU no existe en la lista, lo agregamos
            listaSKUs.push(caracteristica.SKU);
        }
    }
    // Verificar que todos los SKU sean únicos en la base de datos
    for (const SKU of listaSKUs) {
        const existe = yield Producto.findOne({ 'variantes.caracteristicas.SKU': SKU }); // Verifica si en la base de datos haya un objeto que tenga una SKU "parametro" con el mismo valor pasado como argumento en el body
        if (existe) { // Si el SKU es encontrado entonces:
            throw new Error(`El SKU: ${SKU} ya esta registrado`);
        }
        ;
    }
});
export { productoExiste, SKUUnico, variantesValidas };
