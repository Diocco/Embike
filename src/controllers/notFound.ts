import { Request, Response } from 'express';


export const cargarNotFound = (req: Request, res: Response) => {
    res.render("notFound.hbs");
};