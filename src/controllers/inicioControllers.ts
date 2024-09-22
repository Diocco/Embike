import path from 'path';
import { Request, Response } from 'express';

export const cargarIndex = (req: Request, res: Response) => {
    res.render("index.hbs");
};