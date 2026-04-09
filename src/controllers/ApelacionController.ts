import { Request, Response } from 'express';
import { ApelacionService } from '../services/ApelacionService';

export const ApelacionController = {
    
    getFormData: async (_req: Request, res: Response) => {
        try {
            const data = await ApelacionService.getFormData();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error interno' });
        }
    },

    getByFolio: async (req: Request, res: Response) => {
        try {
            const { folio } = req.query; 

            if (!folio) {
                return res.status(400).json({ msg: 'El folio es obligatorio' });
            }

            const apelacion = await ApelacionService.getByFolio(String(folio));

            if (!apelacion) {
                return res.status(404).json({ msg: `No se encontró la apelación con folio: ${folio}` });
            }

            res.json(apelacion);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error interno' });
        }
    }
};