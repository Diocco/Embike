"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cargarNotFound = exports.cargarIndex = exports.cargarCatalogo = void 0;
const cargarCatalogo = (req, res) => {
    res.render("catalogo.hbs");
};
exports.cargarCatalogo = cargarCatalogo;
const cargarIndex = (req, res) => {
    res.render("index.hbs");
};
exports.cargarIndex = cargarIndex;
const cargarNotFound = (req, res) => {
    res.render("notFound.hbs");
};
exports.cargarNotFound = cargarNotFound;
