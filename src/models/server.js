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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const hbs_1 = __importDefault(require("hbs"));
// Base de datos
const config_1 = require("../../database/config");
// Controladores
const archivos_1 = require("../controllers/archivos");
// Rutas
const usuarios_1 = __importDefault(require("../routes/usuarios")); // Usa la extensión '.ts' si el archivo está en TypeScript
const auth_1 = __importDefault(require("../routes/auth")); // Usa la extensión '.ts' si el archivo está en TypeScript
class Server {
    constructor() {
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        this.app = (0, express_1.default)(); // Instancia de Express
        this.port = process.env.PORT || 8080; // Puerto con valor predeterminado
        this.conectarDB(); // Conecta la base de datos
        this.configureMiddleware();
        this.routes(); // Configura las rutas
    }
    conectarDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, config_1.conexionDB)(); // Conecta la base de datos
        });
    }
    // Configura middleware global
    configureMiddleware() {
        // Servir archivos estáticos
        this.app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../src/public')));
        // Configurar motor de vistas Handlebars
        this.app.set('view engine', 'hbs');
        // Configurar la carpeta de vistas
        this.app.set('views', path_1.default.resolve(__dirname, '../public/views'));
        // Registrar parciales de Handlebars
        hbs_1.default.registerPartials(path_1.default.resolve(__dirname, '../public/views/partials'));
        // Parseo de JSON
        this.app.use(express_1.default.json());
    }
    // Configura las rutas
    routes() {
        // HTML
        this.app.get('/', archivos_1.cargarIndex); // Configura la ruta
        this.app.get('/index', archivos_1.cargarIndex); // Configura la ruta
        this.app.get('/catalogo', archivos_1.cargarCatalogo); // Configura la ruta
        this.app.get('/*', archivos_1.cargarNotFound); // Configura la ruta
        // API
        this.app.use(this.usuariosPath, usuarios_1.default);
        this.app.use(this.authPath, auth_1.default);
    }
    // Inicia el servidor
    start() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en http://localhost:${this.port}`);
        });
    }
}
exports.default = Server;
