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
    },

    create: async (req: Request, res: Response) => {
        try {
            // En un proyecto pequeño, pasamos el req.body directo al servicio
            const nuevaApelacion = await ApelacionService.create(req.body);

            res.status(201).json({
                msg: 'Apelación registrada correctamente',
                data: nuevaApelacion
            });
        } catch (error: any) {
            console.error('Error en create:', error);
            
            // Manejo de errores de validación de Sequelize (ej. campos obligatorios faltantes)
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ 
                    msg: 'Datos incompletos o incorrectos', 
                    errors: error.errors.map((e: any) => e.message) 
                });
            }

            res.status(500).json({ msg: 'Error al registrar la apelación' });
        }
    }
};