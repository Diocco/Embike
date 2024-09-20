import path from 'path';
import { Request, Response } from 'express';


export const cargarCatalogo = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/html/catalogo.html'));
};