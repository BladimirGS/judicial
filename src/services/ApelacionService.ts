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
    const apelaciones = await Apelacion.findAll({ // 1. Cambiamos a findAll
        where: { folioOficialia: folio },
        attributes: [
                'id', 'folioOficialia', 'folioApelacion', 'expedienteCausa', 
                'fojas', 'esReposicion', 'fechaAuto', 'observaciones', 'asunto', 'lugarHechos'
            ],
        include: [
            { all: true },
            {
                model: Relacion,
                attributes: ['id', 'activo'],
                separate: false, // Mantener en false si usas subQuery: false
                include: [
                    {
                        model: ApelacionParte,
                        as: 'ofendido',
                        attributes: ['id', 'nombre'],
                        include: [{ model: Sexo, attributes: ['descripcion'] }]
                    },
                    {
                        model: ApelacionParte,
                        as: 'procesado',
                        attributes: ['id', 'nombre'],
                        include: [{ model: Sexo, attributes: ['descripcion'] }]
                    },
                    {
                        model: DelitoRelacion,
                        attributes: ['id'],
                        include: [{ model: Delito, attributes: ['delito'] }]
                    }
                ]
            }
        ],
        subQuery: false, // 2. Esto es vital para que no use subconsultas limitadas
    });

    // 3. Obtenemos el primer resultado (ya que el folio es único)
    const apelacion = apelaciones[0];

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
        localidad: apelacion.localidad?.descripcion ?? 'N/A',

        relaciones: apelacion.relaciones?.map(r => ({
            id: r.id,
            activo: r.activo,
            ofendido: {
                id: r.ofendido?.id,
                nombre: r.ofendido?.nombre ?? 'N/A',
                sexo: r.ofendido?.sexo?.descripcion ?? 'N/A'
            },
            procesado: {
                id: r.procesado?.id,
                nombre: r.procesado?.nombre ?? 'N/A',
                sexo: r.procesado?.sexo?.descripcion ?? 'N/A'
            },
            // 5. dr.delitoRelaciones ahora traerá todos los delitos de esta relación
            delitosRelacion: r.delitoRelaciones?.map(dr => ({
                id: dr.id,
                nombreDelito: dr.delito?.delito ?? 'N/A' 
            })) ?? []
        })) ?? []
    };
}

    static async create(data: any) {
        const nuevaApelacion = await Apelacion.create(data);
        
        return nuevaApelacion;
    }
}