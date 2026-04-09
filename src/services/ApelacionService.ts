import CatMateria from '../models/CatMateria';
import CatJuzgados from '../models/CatJuzgado';
import CatApelacion from '../models/CatApelacion';
import TipoApelacion from '../models/TipoApelacion';
import TipoEscrito from '../models/TipoEscrito';
import CatMunicipio from '../models/CatMunicipio';
import CatLocalidad from '../models/CatLocalidad';
import CatEtnia from '../models/CatEtnia';
import Apelacion from '../models/Apelacion';

export class ApelacionService {

    static async getFormData() {

        const queryOptions = { 
            attributes: ['id', 'descripcion', 'activo']
        };

        const catalogs: Record<string, any> = {
            materias: CatMateria,
            apelaciones: CatApelacion,
            tiposApelaciones: TipoApelacion,
            tiposEscritos: TipoEscrito,
            juzgados: CatJuzgados,
            municipios: CatMunicipio,
            localidades: CatLocalidad,
            etnias: CatEtnia
        };

        const results = await Promise.all(
            Object.values(catalogs).map(model => model.findAll(queryOptions))
        );

        return Object.keys(catalogs).reduce((acc, key, index) => {
            acc[key] = results[index].map((item: any) => ({
                id: item.id,
                descripcion: item.descripcion,
                activo: item.activo
            }));
            return acc;
        }, {} as Record<string, any>);
    }

    static async getByFolio(folio: string) {

        const apelacion = await Apelacion.findOne({
            where: { folioOficialia: folio },
            include: { all: true }
        });

        if (!apelacion) return null;

        return {
            id: apelacion.id,
            folioOficialia: apelacion.folioOficialia,
            folioApelacion: apelacion.folioApelacion,
            expedienteCausa: apelacion.expedienteCausa,
            fojas: apelacion.fojas,
            esReposicion: apelacion.esReposicion,
            fechaAuto: apelacion.fechaAuto,
            observaciones: apelacion.observaciones,
            asunto: apelacion.asunto,
            lugarHechos: apelacion.lugarHechos,

            // Relaciones 
            materia: apelacion.materia?.descripcion ?? 'N/A',
            etnia: apelacion.etnia?.descripcion ?? 'N/A',
            tipoApelacion: apelacion.tipoApelacion?.descripcion ?? 'N/A',
            tipoEscrito: apelacion.tipoEscrito?.descripcion ?? 'N/A',
            juzgadoOrigen: apelacion.catJuzgado?.descripcion ?? 'N/A',
            municipio: apelacion.municipio?.descripcion ?? 'N/A',
            localidad: apelacion.localidad?.descripcion ?? 'N/A'
        };
    }
}