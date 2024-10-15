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
import bcryptjs from 'bcryptjs'; // Encriptar contraseña
import pkg from 'bcryptjs';
const { hashSync } = pkg; // Destructura las funciones que necesitas
import Usuario from '../models/usuario.js';
import { generarJWT } from '../../helpers/generarJWT.js';
import Producto from '../models/productos.js';
const agregarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Desestructura la informacion entrante para usar solo lo que se requiera
    const { nombre, password, correo, rol } = req.body;
    // Crea una nueva entrada con el modelo "Usuario"
    const usuario = new Usuario({ nombre, password, correo, rol }); // A la entrada le agrega la informacion que viene en el body
    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync(); // Genera un "salt" para indicar el nivel de encriptacion
    usuario.password = hashSync(password, salt); // Genera un hash relacionado a la contraseña del usuario
    yield usuario.save(); // Guarda el modelo en la base de datos
    // Generar JWT 
    const token = yield generarJWT(usuario.id);
    res.status(201).json({
        msg: "Usuario guardado en la base de datos",
        token,
        usuario
    });
});
const modificarDeseado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Agrega un producto a la lista de productos deseados, y si ya existe entonces lo elimina de la lista
    // Recibe el id del usuario que se va a modificar la lista, se toma el id del el JWT
    const usuarioVerificado = req.body.usuario;
    // Se toma el ObjetID del producto que se quiere agregar o eliminar
    const nuevoProductoDeseado = req.params.idProducto;
    // Se busca al usuario en la base de datos
    const usuario = (yield Usuario.findById(usuarioVerificado.id));
    // Se busca el indice del producto deseado dentro de la lista de productos deseados del usuario
    const indice = usuario.listaDeseados.indexOf(nuevoProductoDeseado);
    // Si existe el indice entonces quiere decir que el producto ya existe en la lista de deseados
    if (indice !== -1) {
        // Lo elimina de la lista
        usuario.listaDeseados.splice(indice, 1);
        // Guarda los cambios en la base de datos
        usuario.save();
        res.json("Producto eliminado con exito");
    }
    else { // Si no existe el indice:
        // Lo agrega a la lista
        usuario.listaDeseados.push(nuevoProductoDeseado);
        // Guarda los cambios en la base de datos
        usuario.save();
        res.json("Producto agregado con exito");
    }
});
const verDeseados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Devuelve la lista de productos deseados
    const productoCompleto = req.query.productoCompleto; // Almacena el valor, si existe se devuelven los productos completos y no solo sus id
    // Recibe el id del usuario de la lista de deseados, se toma el id del el JWT
    const usuarioVerificado = req.body.usuario;
    // Se busca al usuario en la base de datos
    const usuario = (yield Usuario.findById(usuarioVerificado.id));
    if (!productoCompleto) { // Devuelve solo los id de lista de productos deseados
        res.json(usuario.listaDeseados);
    }
    else { // Devuelve la lista de productos deseados junto a toda su informacion
        let productos = [];
        for (const indice in usuario.listaDeseados) {
            const id = usuario.listaDeseados[indice];
            const producto = yield Producto.findById(id);
            productos.push(producto);
        }
        res.status(200).json(productos);
    }
});
const actualizarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { nombre, activo, google, _id, __v, password } = _a, resto = __rest(_a, ["nombre", "activo", "google", "_id", "__v", "password"]); // Deja en "resto" las propiedades que son modificables
    if (password) { // Si se mando una contraseña:
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync(); // Genera un "salt" para indicar el nivel de encriptacion
        resto.password = hashSync(password, salt); // Genera un hash relacionado a la contraseña del usuario y la agrega al resto de propiedades
    }
    // Busca por id en la base de datos que actualiza las propiedades que esten en "resto". { new: true } devuelve el documento actualizado
    const usuario = yield Usuario.findByIdAndUpdate(id, { resto }, { new: true });
    res.status(200).json({
        msg: "Usuario actualizado en la base de datos",
        usuario
    });
});
const verUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const desde = Math.abs(Number(req.query.desde)) || 0; // Valor por defecto 0 si no se pasa el parámetro o es invalido
    const cantidad = Math.abs(Number(req.query.cantidad)) || 10; // Valor por defecto 10 si no se pasa el parámetro o es invalido
    const condicion = { activo: true }; // Condicion que debe cumplir la busqueda de usuarios
    // Crea un array de promesas que no son independientes entre ellas para procesarlas en paralelo
    const [usuarios, usuariosCantidad] = yield Promise.all([
        Usuario.find(condicion) // Busca a todos los usuarios en la base de datos que cumplen la condicion
            .skip(desde).limit(cantidad),
        Usuario.countDocuments(condicion) // Devuelve la cantidad de objetos que hay que cumplen con la condicion
    ]);
    // Indica la cantidad de paginas que se necesitan para mostrar todos los resultados
    const paginasCantidad = Math.ceil(usuariosCantidad / cantidad);
    res.status(200).json({
        usuariosCantidad,
        paginasCantidad,
        usuarios
    });
});
const verUsuarioToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioVerificado = req.body.usuario;
    res.status(200).json({
        usuarioVerificado
    });
});
const eliminarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Desestructura el id
    // Busca el usuario con ese id y cambia su estado de actividad
    const usuario = yield Usuario.findByIdAndUpdate(id, { activo: false }, { new: true });
    const usuarioAutenticado = req.body.usuario;
    res.status(200).json({
        usuario,
        usuarioAutenticado
    });
});
export { agregarUsuario, actualizarUsuario, verUsuarios, eliminarUsuario, verUsuarioToken, modificarDeseado, verDeseados };
