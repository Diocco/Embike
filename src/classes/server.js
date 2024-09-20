"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const routes_1 = __importDefault(require("../routes/routes")); // Usa la extensión '.ts' si el archivo está en TypeScript
class Server {
    constructor() {
        this.app = (0, express_1.default)(); // Instancia de Express
        this.port = process.env.PORT || 3000; // Puerto con valor predeterminado
        this.configureMiddleware();
        this.routes(); // Configura las rutas
    }
    // Configura middleware global
    configureMiddleware() {
        this.app.use(express_1.default.json()); // Parseo de JSON
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '../../src/public')));
    }
    // Configura las rutas
    routes() {
        this.app.use('/', routes_1.default); // Asocia las rutas a la API
        // Puedes agregar más rutas aquí
    }
    // Inicia el servidor
    start() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en http://localhost:${this.port}`);
        });
    }
}
exports.default = Server;
