import express from 'express';
import path from 'path'
import 'dotenv/config';
import routes from '../routes/routes'; // Usa la extensión '.ts' si el archivo está en TypeScript
import hbs from 'hbs';
import { conexionDB } from '../../database/config';



class Server {
    app: express.Application;
    port: string | number;

    constructor() {
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
        this.app.use('/', routes); // Asocia las rutas a la API
        // Puedes agregar más rutas aquí
    }

    // Inicia el servidor
    start() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en http://localhost:${this.port}`);
        });
    }
}

export default Server;