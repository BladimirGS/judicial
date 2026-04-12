import CatMateria from '../models/CatMateria';
import CatJuzgados from '../models/CatJuzgado';
import CatApelacion from '../models/CatApelacion';
import TipoApelacion from '../models/TipoApelacion';
import TipoEscrito from '../models/TipoEscrito';
import CatMunicipio from '../models/CatMunicipio';
import CatLocalidad from '../models/CatLocalidad';
import CatEtnia from '../models/CatEtnia';
import Apelacion from '../models/Apelacion';
import ApelacionParte from '../models/ApelacionParte';
import TipoParte from '../models/TipoParte';
import Sexo from '../models/Sexo';
import Relacion from '../models/Relacion';
import DelitoRelacion from '../models/DelitoRelacion';
import Delito from '../models/Delito';

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
            include: [
                { all: true }, // Catálogos básicos
                // {
                //     model: ApelacionParte,
                //     include: [{ model: TipoParte }, { model: Sexo }]
                // },
                {
                    model: Relacion,
                    include: [
                        { all: true },
                        // { 
                        //     model: ApelacionParte, 
                        //     as: 'apelacionParteOfendido', // Asegúrate de que este alias exista en el BelongsTo de Relacion
                        //     include: [TipoParte] 
                        // },
                        // { 
                        //     model: ApelacionParte, 
                        //     as: 'apelacionParteProcesado', // Lo mismo aquí
                        //     include: [TipoParte] 
                        // },
                        // {
                        //     model: DelitoRelacion,
                        //     include: [Delito]
                        // }
                    ]
                }
            ],
            // IMPORTANTE: Esto evita que Sequelize use subconsultas complejas 
            // que suelen romper SQL Server con muchos Joins
            subQuery: false 
        });

        if (!apelacion) return null;

        // Mapeo del objeto de respuesta
        // return {
        //     ...apelacion.get({ plain: true }), // Obtenemos los datos base
        //     // Formateamos las partes
        //     partes: apelacion.partes?.map(p => ({
        //         id: p.id,
        //         nombre: p.nombre, // asumiendo que tiene nombre
        //         tipo: p.tipoParte?.descripcion ?? 'N/A',
        //         sexo: p.sexo?.descripcion ?? 'N/A'
        //     })),
        //     // Formateamos las relaciones y sus delitos
        //     relaciones: apelacion.relaciones?.map(r => ({
        //         id: r.id,
        //         ofendido: r.apelacionParteOfendido?.nombre ?? 'N/A',
        //         procesado: r.apelacionParteProcesado?.nombre ?? 'N/A',
        //         delitos: r.delitoRelaciones?.map(dr => dr.delito?.delito) ?? []
        //     })),
        //     // Mantienes tus mapeos anteriores de catálogos
        //     materia: apelacion.materia?.descripcion ?? 'N/A',
        //     etnia: apelacion.etnia?.descripcion ?? 'N/A',
        //     // ... resto de tus mapeos
        // };

        
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

    static async create(data: any) {
        const nuevaApelacion = await Apelacion.create(data);
        
        return nuevaApelacion;
    }
}