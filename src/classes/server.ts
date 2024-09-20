import express from 'express';
import path from 'path'
import 'dotenv/config';
import routes from '../routes/routes'; // Usa la extensión '.ts' si el archivo está en TypeScript



class Server {
    app: express.Application;
    port: string | number;

    constructor() {
        this.app = express(); // Instancia de Express
        this.port = process.env.PORT || 3000; // Puerto con valor predeterminado
        this.configureMiddleware();
        this.routes(); // Configura las rutas
    }

    // Configura middleware global
    configureMiddleware() {
        this.app.use(express.json()); // Parseo de JSON
        this.app.use(express.static(path.join(__dirname, '../../src/public')));
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