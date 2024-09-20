import express from 'express';
import { cargarIndex} from '../controllers/inicioControllers'; // Asegúrate de la ruta correcta
import { cargarCatalogo } from '../controllers/catalogo'; // Asegúrate de la ruta correcta

const router = express.Router();

router.get('/', cargarIndex); // Configura la ruta
router.get('/index', cargarIndex); // Configura la ruta
router.get('/catalogo', cargarCatalogo); // Configura la ruta


export default router;