import path from 'path';
import { Request, Response } from 'express';


export const cargarCatalogo = (req: Request, res: Response) => {
    res.render("catalogo.hbs");
};