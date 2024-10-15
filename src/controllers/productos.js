var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Producto from '../models/productos.js';
import Categoria from '../models/categoria.js';
// Devuelve todas las productos
const verProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idProductos } = req.body;
    if (idProductos) { // Si se envia como parametro un array con id's entonces se devuelve esos productos especificos
        let productos = [];
        for (const indice in idProductos) {
            const id = idProductos[indice];
            const producto = yield Producto.findById(id);
            productos.push(producto);
        }
        res.status(200).json(productos);
    }
    else { // Si se envian queryparams entonces se buscan todos los productos filtrados por los parametros recibidos
        const desde = Math.abs(Number(req.query.desde)) || 0; // Valor por defecto 0 si no se pasa el parámetro o es invalido
        const cantidad = Math.abs(Number(req.query.cantidad)) || 10; // Valor por defecto 10 si no se pasa el parámetro o es invalido
        const precioMin = Math.abs(Number(req.query.precioMin)) || 0; // Precio minimo del producto
        const precioMax = Math.abs(Number(req.query.precioMax)) || 1000000000; // Precio maximo del producto
        const palabraBuscada = req.query.palabraBuscada || ''; // Palabra buscada por el usuario
        const categoriasNombresCadena = req.query.categorias || ''; // Categorias especificadas por el usuario en formato de cadena con separador por coma Ej:(categ1,categ2,categ3,)
        // Se obtiene la forma de ordenar los resultados
        let ordenar = {}; // Inicia la variable vacia
        if (req.query.ordenar) { // Verifica si se envio la variable
            if (req.query.ordenar === 'precioMax') {
                ordenar = { precio: -1 }; // Ordena por precio descendente
            }
            else if (req.query.ordenar === 'precioMin') {
                ordenar = { precio: 1 }; // Ordena por precio ascendente
            }
        }
        const categoriasNombreArreglo = categoriasNombresCadena.split(',').filter(Boolean); // Convierte la cadena en un arreglo
        // Busca las categorías por sus nombres
        let categoriasEncontradas;
        if (categoriasNombreArreglo[0]) { // Si se pasa como argumento las categorias especificas:
            categoriasEncontradas = yield Categoria.find({ nombre: { $in: categoriasNombreArreglo } });
        }
        else { // Si no se busco ninguna categoria en particular entonces busca todas las categorias validas
            categoriasEncontradas = yield Categoria.find();
        }
        // Extrae los ObjectId de las categorías encontradas
        const categoriasIds = categoriasEncontradas.map(categoria => categoria._id);
        // Definir la expresión regular para buscar productos cuyo nombre, descripción, etc., contenga la palabra buscada
        const palabraBuscadaRegExp = new RegExp(palabraBuscada, 'i');
        const filtros = {
            // Los filtros opcionales donde el valor buscado puede estar en varias propiedades
            $or: [
                { nombre: palabraBuscadaRegExp },
                { marca: palabraBuscadaRegExp },
                { modelo: palabraBuscadaRegExp },
                { descripcion: palabraBuscadaRegExp },
                { tags: { $in: [palabraBuscadaRegExp] } } // Aquí el uso de $in, pero asegurándonos que tags es un array
            ],
            $and: [
                { estado: true }, // El producto debe estar disponible
                { precio: { $gte: precioMin, $lte: precioMax } }, // Rango de precios
                { categoria: { $in: categoriasIds } } // Las categorías deben ser parte de las seleccionadas
            ]
        };
        // Crea un array de promesas que no son independientes entre ellas para procesarlas en paralelo
        const [productos, productosCantidad] = yield Promise.all([
            Producto.find(filtros) // Busca a todos los productos en la base de datos que cumplen la condicion
                .skip(desde).sort(ordenar).limit(cantidad),
            Producto.countDocuments(filtros) // Devuelve la cantidad de objetos que hay que cumplen con la condicion
        ]);
        // Indica la cantidad de paginas que se necesitan para mostrar todos los resultados
        const paginasCantidad = Math.ceil(productosCantidad / cantidad);
        res.status(200).json({
            categoriasIds,
            productosCantidad,
            paginasCantidad,
            productos
        });
    }
});
// Devuelve la producto con el id pasado como parametro
const verProductoID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const producto = yield Producto.findById(id);
    res.status(200).json(producto);
});
// Crea una nueva producto
const crearProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, // Desestructura la informacion del body para utilizar solo la informacion requerida
    marca, modelo, categoria, variantes, descripcion, precio, precioViejo, especificaciones, disponible, tags } = req.body;
    const usuario = req.body.usuario;
    const data = {
        nombre,
        marca,
        modelo,
        usuario,
        categoria,
        variantes,
        descripcion,
        precio,
        precioViejo,
        especificaciones,
        disponible,
        tags
    };
    const producto = new Producto(data); // Crea una nueva producto
    yield producto.save(); // La guarda en la base de datos
    res.json(`Se creo la producto ${nombre}`);
});
// Agrega variantes de un producto
const agregarVariante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Busca el producto al cual hay que agregarle la variante
    const { id } = req.params;
    const producto = yield Producto.findById(id);
    const variantes = producto.variantes; // Recupera las variantes actual del producto
    let respuesta; // Variable que almacena la respuesta del servidor segun como se resuelva la solicitud
    const { // Desestructura la informacion del body para utilizar solo la informacion requerida
    color, talle, SKU, stock, imagenes, } = req.body;
    // Verifica si existe una variante con el mismo color que el que se obtuvo como valor de entrada
    variantes.forEach(variante => {
        if (variante.color === color) {
            // Si el producto ya tiene una variante con el mismo color que el color recibido de entrada entonces verifica si el talle tambien existe o es nuevo
            let varianteActualizada = false; // Valor que indica si se actualizo la variante o no
            variante.caracteristicas.forEach(caracteristicas => {
                if (caracteristicas.talle === talle) {
                    // Si el producto ya tiene el color y el talle recibido como valores de entrada entonces actualiza los valores
                    // Solo cambia el valor de la variante si el valor de entrada no es nulo
                    caracteristicas.SKU = SKU ? SKU : caracteristicas.SKU;
                    caracteristicas.stock = stock ? stock : caracteristicas.stock;
                    caracteristicas.imagenes = imagenes ? imagenes : caracteristicas.imagenes;
                    varianteActualizada = true; // Se especifica que se actualizo la variante
                    respuesta = "Se actualizo la variante";
                }
            });
            if (!varianteActualizada) { // Si no se actualizo ninguna variante entonces es porque el talle recibido como argumento no forma parte de las variantes actuales del producto
                // Agrega la talle recibida como argumento como una variante nueva
                if (!SKU) { // Si el SKU es nulo entonces devuelve un mensaje de error
                    return res.status(400).json({
                        errors: [{
                                msg: "El SKU es obligatorio para crear una nueva variante",
                                path: "SKU"
                            }]
                    });
                }
                const nuevaVariante = {
                    talle,
                    SKU,
                    stock,
                    imagenes
                };
                variante.caracteristicas.push(nuevaVariante);
                respuesta = "Se agrego la variante con un nuevo talle";
            }
        }
        else {
            // Si el producto no cuenta con la variante con el mismo color que el recibido como argumento entonces crea una nueva variante
            if (!SKU) { // Si el SKU es nulo entonces devuelve un mensaje de error
                return res.status(400).json({
                    errors: [{
                            msg: "El SKU es obligatorio para crear una nueva variante",
                            path: "SKU"
                        }]
                });
            }
            // Estructura la informacion para enviarla correctamente al servidor
            const varianteNueva = {
                color,
                caracteristicas: {
                    talle,
                    SKU,
                    stock,
                    imagenes,
                }
            };
            variantes.push(varianteNueva);
            respuesta = "Se creo la nueva variante";
        }
    });
    yield Producto.findOneAndUpdate({ _id: id }, { variantes });
    res.json(respuesta);
});
// Actualiza una producto con el id pasado como parametro
const actualizarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, // Desestructura la informacion del body para utilizar solo la informacion requerida
    marca, modelo, categoria, color, talle, SKU, stock, imagenes, descripcion, precio, precioViejo, especificaciones, disponible, tags } = req.body;
    const usuario = req.body.usuario;
    // Estructura la informacion para enviarla correctamente al servidor
    const variantes = [{
            color,
            caracteristicas: {
                talle,
                SKU,
                stock,
                imagenes,
            }
        }];
    const data = {
        nombre,
        marca,
        modelo,
        usuario,
        categoria,
        variantes,
        descripcion,
        precio,
        precioViejo,
        especificaciones,
        disponible,
        tags
    };
    // Busca por id en la base de datos que actualiza las propiedades que esten en el segundo parametro. { new: true } devuelve el documento actualizado
    const productoActualizado = yield Producto.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json({
        msg: "Producto actualizado en la base de datos",
        productoActualizado
    });
});
// Elimina un producto con el id pasado como parametro
const eliminarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Desestructura el id
    // Busca la producto con ese id y cambia su estado de actividad
    const productoEliminado = yield Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
    const usuarioAutenticado = req.body.producto;
    res.status(200).json({
        productoEliminado,
        usuarioAutenticado
    });
});
export { verProductos, verProductoID, crearProducto, actualizarProducto, eliminarProducto, agregarVariante };
