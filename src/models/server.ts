import express from 'express';
import path from 'path'
import 'dotenv/config';
import hbs from 'hbs';

// Base de datos
import { conexionDB } from '../../database/config';

// Controladores
import { 
    cargarCatalogo, 
    cargarIndex, 
    cargarNotFound } from '../controllers/archivos';

// Rutas
import usuariosRoutes from '../routes/usuarios'; // Usa la extensión '.ts' si el archivo está en TypeScript
import authRoutes from '../routes/auth'; // Usa la extensión '.ts' si el archivo está en TypeScript


class Server {
    // Variables
    usuariosPath: string
    authPath: string
    

    app: express.Application;
    port: string | number;

    constructor() {
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        this.app = express(); // Instancia de Express
        this.port = process.env.PORT || 8080; // Puerto con valor predeterminado
        this.conectarDB() // Conecta la base de datos
        this.configureMiddleware();
        this.routes(); // Configura las rutas
    }

    async conectarDB(){
        await conexionDB(); // Conecta la base de datos
    }

    // Configura middleware global
    configureMiddleware() {
        // Servir archivos estáticos
        this.app.use(express.static(path.resolve(__dirname, '../../src/public')));

        // Configurar motor de vistas Handlebars
        this.app.set('view engine', 'hbs');

        // Configurar la carpeta de vistas
        this.app.set('views', path.resolve(__dirname, '../public/views')); 

        // Registrar parciales de Handlebars
        hbs.registerPartials(path.resolve(__dirname, '../public/views/partials'));

        // Parseo de JSON
        this.app.use(express.json());
    }

    // Configura las rutas
    routes() {
        // HTML
        this.app.get('/', cargarIndex); // Configura la ruta
        this.app.get('/index', cargarIndex); // Configura la ruta
        this.app.get('/catalogo', cargarCatalogo); // Configura la ruta
        this.app.get('/*', cargarNotFound); // Configura la ruta

        // API
        this.app.use(this.usuariosPath, usuariosRoutes);
        this.app.use(this.authPath, authRoutes);

    }

    // Inicia el servidor
    start() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en http://localhost:${this.port}`);
        });
    }
}

export default Server;