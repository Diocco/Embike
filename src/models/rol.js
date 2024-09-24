"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const rolSchema = new mongoose_1.default.Schema({
    rol: {
        type: String,
        required: [true, "El rol es obligatorio"] //Mensaje de error personalizado
    }
});
const Role = mongoose_1.default.model('Role', rolSchema);
exports.default = Role;
