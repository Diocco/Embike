"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCampos = void 0;
const express_validator_1 = require("express-validator");
const validarCampos = (req, res, next) => {
    // Revisa las validaciones
    const errores = (0, express_validator_1.validationResult)(req); // Si las validaciones lanzaron errores se van a guardar aca
    if (!errores.isEmpty()) { // Si "errores" NO esta vacio entonces:
        return res.status(400).json(errores); // Devuelve un mensaje de error
    }
    next(); // Indica que si no dio errores entonces que sigue con los siguientes middlewares
};
exports.validarCampos = validarCampos;
