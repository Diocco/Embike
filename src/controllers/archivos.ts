
import { Request, Response } from 'express';

const cargarCatalogo = (req: Request, res: Response) => {
    res.render("catalogo.hbs");
};

const cargarIndex = (req: Request, res: Response) => {
    res.render("index.hbs");
};

const cargarInicioSesion = (req: Request, res: Response) => {
    res.render("inicioSesion.hbs");
};

const cargarNotFound = (req: Request, res: Response) => {
    res.render("notFound.hbs");
};

const cargarProducto = (req: Request, res: Response) => {
    res.render("producto.hbs");
};




export{
    cargarCatalogo,
    cargarIndex,
    cargarNotFound,
    cargarInicioSesion,
    cargarProducto
}