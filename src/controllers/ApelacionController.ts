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

search: async (req: Request, res: Response) => {
    try {
        // Recibimos el JSON desde el body
        const filtros = req.body;

        if (Object.keys(filtros).length === 0) {
            return res.status(400).json({ msg: 'Debe proporcionar al menos un criterio de búsqueda' });
        }

        const resultados = await ApelacionService.search(filtros);

        res.json(resultados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al realizar la búsqueda' });
    }
},

    create: async (req: Request, res: Response) => {
        try {
            // El req.body debe contener el objeto anidado
            const nuevaApelacion = await ApelacionService.create(req.body);

            res.status(201).json({
                msg: 'Apelación registrada correctamente',
                data: nuevaApelacion
            });
        } catch (error: any) {
            console.error('Error en create:', error);
            
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ 
                    msg: 'Datos incompletos o incorrectos', 
                    errors: error.errors.map((e: any) => e.message) 
                });
            }

            // Error específico de SQL Server (ej. llaves foráneas inexistentes)
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ msg: 'Error de relación: Uno de los IDs de catálogo no existe' });
            }

            res.status(500).json({ msg: 'Error al registrar la apelación en el servidor' });
        }
    },

    listAnexos: async (_req: Request, res: Response) => {
        try {
            const data = await ApelacionService.listAnexos();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error interno' });
        }
    },
    
agregarAnexo: async (req: Request, res: Response) => {
    try {
        // req.body debe contener el id de la apelación y el array de anexos
        const anexosRegistrados = await ApelacionService.agregarAnexo(req.body);

        res.status(201).json({
            msg: 'Anexos agregados correctamente',
            data: anexosRegistrados
        });
    } catch (error: any) {
        console.error('Error en agregarAnexo:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                msg: 'Datos de anexos incorrectos', 
                errors: error.errors.map((e: any) => e.message) 
            });
        }

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ msg: 'Error: El ID de la apelación o del tipo de anexo no existe' });
        }

        res.status(500).json({ msg: 'Error al registrar los anexos' });
    }
}

};