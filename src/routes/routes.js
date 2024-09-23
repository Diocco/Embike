"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inicioControllers_1 = require("../controllers/inicioControllers"); // Asegúrate de la ruta correcta
const catalogo_1 = require("../controllers/catalogo"); // Asegúrate de la ruta correcta
const notFound_1 = require("../controllers/notFound"); // Asegúrate de la ruta correcta
const router = express_1.default.Router();
router.get('/', inicioControllers_1.cargarIndex); // Configura la ruta
router.get('/index', inicioControllers_1.cargarIndex); // Configura la ruta
router.get('/catalogo', catalogo_1.cargarCatalogo); // Configura la ruta
router.get('/*', notFound_1.cargarNotFound); // Configura la ruta
exports.default = router;
