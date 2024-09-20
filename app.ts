import Server from './src/classes/server'; // Usa la extensión '.ts' si el archivo está en TypeScript
import 'dotenv/config';


const server = new Server(); // Instancia la clase Server
server.start(); // Inicia el servidor

