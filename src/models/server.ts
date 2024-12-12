import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'
import 'dotenv/config';
import hbs from 'hbs';
import cors from 'cors'

// Directorio
const __filename = fileURLToPath(import.meta.url); // Obtiene el nombre del archivo actual
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual

// Base de datos
import  conexionDB  from '../routes/conexionConServidor.js'

// Controladores
import { 
    cargarCatalogo, 
    cargarIndex, 
    cargarInicioSesion, 
    cargarNotFound,
    cargarProducto,
    cargarListaDeseados,
    cargarMiPerfil,
    cargarRegistener,
    } from '../controllers/archivos.js';

// Rutas
import usuariosRoutes from '../routes/usuarios.js';
import authRoutes from '../routes/auth.js'; 
import metodosPagoRoutes from '../routes/metodosPago.js'; 
import categoriasRoutes from '../routes/categorias.js'; 
import productosRoutes from '../routes/productos.js'; 
import variantesRoutes from '../routes/variantes.js';
import registroVentasRoutes from '../routes/registroVentas.js';

import fileUpload from 'express-fileupload';



class Server {
    // Variables
    usuariosPath: string
    authPath: string
    categoriasPath:string
    productosPath:string
    variantesPath:string
    registroVentasPath:string
    metodoPagoPath:string
    conexionConServidor:string

    app: express.Application;
    port: string | number;

    constructor() {
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        this.variantesPath = '/api/variantes';
        this.registroVentasPath = '/api/registroVentas';
        this.metodoPagoPath = '/api/metodoPago';
        this.conexionConServidor = '/api/conexion';
        
        this.app = express(); // Instancia de Express
        this.port = process.env.PORT || 8080; // Puerto con valor predeterminado
        this.configureMiddleware();
        this.routes(); // Configura las rutas
    }


    // Configura middleware globalnpm
    configureMiddleware() {

        // Aplica las opciones de CORS a todas las rutas
        this.app.use(cors());

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

        // Carga de archivos
        this.app.use(fileUpload());
    }

    // Configura las rutas
    routes() {
        
        // API
        this.app.use(this.conexionConServidor,conexionDB)
        this.app.use(this.usuariosPath, usuariosRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.categoriasPath, categoriasRoutes);
        this.app.use(this.metodoPagoPath, metodosPagoRoutes);
        this.app.use(this.productosPath, productosRoutes);
        this.app.use(this.variantesPath, variantesRoutes);
        this.app.use(this.registroVentasPath, registroVentasRoutes);
        
        // HTML
        this.app.get('/', cargarIndex); // Configura la ruta
        this.app.get('/index', cargarIndex); // Configura la ruta
        this.app.get('/catalogo', cargarCatalogo); // Configura la ruta
        this.app.get('/inicioSesion', cargarInicioSesion); // Configura la ruta
        this.app.get('/listaDeseados', cargarListaDeseados); // Configura la ruta
        this.app.get('/producto/*', cargarProducto); // Configura la ruta
        this.app.get('/miPerfil', cargarMiPerfil); // Configura la ruta
        this.app.get('/registener', cargarRegistener); // Configura la ruta
        this.app.get('/*', cargarNotFound); // Configura la ruta
    }

    // Inicia el servidor
    start() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en http://localhost:${this.port}`);
        });
    }
    
}

export default Server;