import { Request, Response } from 'express';
import { ApelacionService } from '../services/ApelacionService';

export const AnexoController = {
    
    getAll: async (_req: Request, res: Response) => {
        try {
            const data = await ApelacionService.getFormData();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error interno' });
        }
    },
};