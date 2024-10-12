"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cargarProducto = exports.cargarInicioSesion = exports.cargarNotFound = exports.cargarIndex = exports.cargarCatalogo = void 0;
const cargarCatalogo = (req, res) => {
    res.render("catalogo.hbs");
};
exports.cargarCatalogo = cargarCatalogo;
const cargarIndex = (req, res) => {
    res.render("index.hbs");
};
exports.cargarIndex = cargarIndex;
const cargarInicioSesion = (req, res) => {
    res.render("inicioSesion.hbs");
};
exports.cargarInicioSesion = cargarInicioSesion;
const cargarNotFound = (req, res) => {
    res.render("notFound.hbs");
};
exports.cargarNotFound = cargarNotFound;
const cargarProducto = (req, res) => {
    res.render("producto.hbs");
};
exports.cargarProducto = cargarProducto;
