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
import Sexo from '../models/CatSexo';
import Relacion from '../models/Relacion';
import DelitoRelacion from '../models/DelitoRelacion';
import CatDelito from '../models/CatDelito';
import { sequelize } from '../config/database';
import { Transaction } from 'sequelize';

export class ApelacionService {

    static async getFormData() {
        const catalogs: Record<string, any> = {
            materias: CatMateria,
            apelaciones: CatApelacion,
            tiposApelaciones: TipoApelacion,
            tiposEscritos: TipoEscrito,
            juzgados: CatJuzgados,
            municipios: CatMunicipio,
            localidades: CatLocalidad,
            etnias: CatEtnia,
            delitos: CatDelito
        };

        const results = await Promise.all(
            Object.entries(catalogs).map(async ([key, model]) => {
                const attributes = ['id', 'activo', key === 'delitos' ? 'delito' : 'descripcion'];
                
                const data = await model.findAll({ attributes });
                
                return data.map((item: any) => ({
                    id: item.id,
                    activo: item.activo,
                    descripcion: key === 'delitos' ? item.delito : item.descripcion
                }));
            })
        );

        return Object.keys(catalogs).reduce((acc, key, index) => {
            acc[key] = results[index];
            return acc;
        }, {} as Record<string, any>);
    }

    static async getByFolio(folio: string) {
        const apelaciones = await Apelacion.findAll({ 
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
                    separate: false, 
                    include: [
                        {
                            model: ApelacionParte,
                            as: 'ofendido',
                            attributes: ['id', 'nombre'],
                            include: [
                                { model: Sexo, attributes: ['descripcion'] },
                                { model: TipoParte, attributes: ['descripcion'] }
                            ]
                        },
                        {
                            model: ApelacionParte,
                            as: 'procesado',
                            attributes: ['id', 'nombre'],
                            include: [
                                { model: Sexo, attributes: ['descripcion'] },
                                { model: TipoParte, attributes: ['descripcion'] }
                            ]
                        },
                        {
                            model: DelitoRelacion,
                            attributes: ['id'],
                            include: [{ model: CatDelito, attributes: ['delito'] }]
                        }
                    ]
                }
            ],
            subQuery: false, 
        });

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
                    sexo: r.ofendido?.sexo?.descripcion ?? 'N/A',
                    tipoParte: r.ofendido?.tipoParte?.descripcion ?? 'N/A'
                },
                procesado: {
                    id: r.procesado?.id,
                    nombre: r.procesado?.nombre ?? 'N/A',
                    sexo: r.procesado?.sexo?.descripcion ?? 'N/A',
                    tipoParte: r.procesado?.tipoParte?.descripcion ?? 'N/A'
                },
                
                delitosRelacion: r.delitoRelaciones?.map(dr => ({
                    id: dr.id,
                    nombreDelito: dr.delito?.delito ?? 'N/A' 
                })) ?? []
            })) ?? []
        };
    }

static async create(data: any) {
    const t = await sequelize.transaction(); // <--- USAR LA INSTANCIA IMPORTADA

    try {
        const nuevaApelacion = await Apelacion.create(data, {
            include: [
                {
                    model: Relacion,
                    as: 'relaciones',
                    include: [
                        { model: ApelacionParte, as: 'ofendido' },
                        { model: ApelacionParte, as: 'procesado' },
                        { model: DelitoRelacion, as: 'delitoRelaciones' }
                    ]
                }
            ],
            transaction: t // <--- PASAR LA TRANSACCIÓN AQUÍ
        });

        await t.commit();
        return nuevaApelacion;
    } catch (error) {
        // Solo intentamos rollback si la conexión sigue viva
        if (t) await t.rollback();
        throw error;
    }
}
}