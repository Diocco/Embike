
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

const cargarListaDeseados = (req: Request, res: Response) => {
    res.render("listaDeseados.hbs");
};

const cargarMiPerfil = (req: Request, res: Response) => {
    res.render("miPerfil.hbs");
};

const cargarRegistener = (req: Request, res: Response) => {
    res.render("registener.hbs");
};




export{
    cargarCatalogo,
    cargarIndex,
    cargarNotFound,
    cargarInicioSesion,
    cargarProducto,
    cargarListaDeseados,
    cargarMiPerfil,
    cargarRegistener
}