import { Request, Response } from 'express';
import { ApelacionService } from '../services/ApelacionService';
import { ApelacionFormDTO } from '../dtos/ApelacionForm.dto';
import { ApelacionDetailDTO } from '../dtos/ApelacionDetail.dto';

export const ApelacionController = {
    
    // 1. Obtener datos para llenar el formulario (Selects)
    getFormData: async (req: Request, res: Response) => {
        try {
            // El Service se encarga de los 8-9 modelos internos
            const formData: ApelacionFormDTO = await ApelacionService.getCaptureFormData();
            res.json(formData);
        } catch (error) {
            console.error('Error en getFormData:', error);
            res.status(500).json({ msg: 'Error al cargar la configuración del formulario' });
        }
    },

    // 2. Obtener una sola apelación detallada (Búsqueda)
    getByFolio: async (req: Request, res: Response) => {
        try {
            // Ahora viene de req.query, no de req.params
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
            console.error('Error en getByFolio:', error);
            res.status(500).json({ msg: 'Error al buscar la apelación por folio' });
        }
    }
};