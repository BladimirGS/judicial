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
// import CatAnexo from '../models/CatAnexo';
import { Op } from 'sequelize';
import ApelacionAnexo from '../models/ApelacionAnexo';
import { CatAnexo } from '../entities/CatAnexo.entity';
import { AppDataSource } from '../config/typeorm.config';

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
                    attributes: ['id'],
                    separate: false, 
                    include: [
                        {
                            model: ApelacionParte,
                            as: 'ofendido',
                            attributes: ['id', 'nombre', 'direccion', 'menorEdad', 'activo'],
                            include: [
                                { model: Sexo, attributes: ['descripcion'] },
                                { model: TipoParte, attributes: ['descripcion'] }
                            ]
                        },
                        {
                            model: ApelacionParte,
                            as: 'procesado',
                            attributes: ['id', 'nombre', 'direccion', 'menorEdad', 'activo'],
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
                ofendido: {
                    id: r.ofendido?.id,
                    nombre: r.ofendido?.nombre ?? 'N/A',
                    direccion: r.ofendido?.direccion ?? 'N/A',
                    menorEdad: r.ofendido?.menorEdad ?? true,
                    sexo: r.ofendido?.sexo?.descripcion ?? 'N/A',
                    tipoParte: r.ofendido?.tipoParte?.descripcion ?? 'N/A'
                },
                procesado: {
                    id: r.procesado?.id,
                    nombre: r.procesado?.nombre ?? 'N/A',
                    direccion: r.procesado?.direccion ?? 'N/A',
                    menorEdad: r.procesado?.menorEdad ?? true,
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

static async search(params: any) {
    const where: any = {};
    const whereParte: any = {};
    const whereDelito: any = {};

    // --- Filtros Tabla Principal ---
    if (params.id) where.id = params.id;
    if (params.folioOficialia) where.folioOficialia = { [Op.like]: `%${params.folioOficialia}%` };
    if (params.folioApelacion) where.folioApelacion = { [Op.like]: `%${params.folioApelacion}%` };
    if (params.expedienteCausa) where.expedienteCausa = { [Op.like]: `%${params.expedienteCausa}%` };
    
    // Filtro de fecha exacto o por rango
    if (params.fechaAuto) {
        where.fechaAuto = params.fechaAuto; 
    }

    // --- Filtros Tablas Relacionadas ---
    if (params.nombreParte) {
        whereParte.nombre = { [Op.like]: `%${params.nombreParte}%` };
    }
    
    if (params.nombreDelito) {
        whereDelito.delito = { [Op.like]: `%${params.nombreDelito}%` };
    }

    return await Apelacion.findAll({
        where,
        include: [
            {
                model: Relacion,
                as: 'relaciones',
                include: [
                    { 
                        model: ApelacionParte, 
                        as: 'ofendido',
                        where: params.nombreParte ? whereParte : undefined,
                        required: false // Permitir que encuentre aunque solo coincida uno
                    },
                    { 
                        model: ApelacionParte, 
                        as: 'procesado',
                        where: params.nombreParte ? whereParte : undefined,
                        required: false 
                    },
                    {
                        model: DelitoRelacion,
                        as: 'delitoRelaciones',
                        include: [{
                            model: CatDelito,
                            as: 'delito',
                            where: params.nombreDelito ? whereDelito : undefined
                        }]
                    }
                ]
            }
        ]
    });
}

static async create(data: any) {
    const t = await sequelize.transaction();

    try {
        // 1. Crear la Apelación primero para obtener el ID real de SQL Server
        // Solo enviamos los datos de la apelación (sin hijos aún)
        const nuevaApelacion = await Apelacion.create(data, { transaction: t });

        // 2. Si hay relaciones, las procesamos e inyectamos el ID manualmente
        if (data.relaciones && Array.isArray(data.relaciones)) {
            for (const rel of data.relaciones) {
                
                // Propagamos el IdApelacion y Activo a las Partes (Ofendido/Procesado)
                // Esto asegura que no lleguen NULL a la BD
                const partesData = [];
                
                if (rel.ofendido) {
                    partesData.push({
                        ...rel.ofendido,
                        idApelacion: nuevaApelacion.id,
                        activo: data.activo ?? true,
                        menorEdad: false
                    });
                }
                
                if (rel.procesado) {
                    partesData.push({
                        ...rel.procesado,
                        idApelacion: nuevaApelacion.id,
                        activo: data.activo ?? true,
                        menorEdad: false
                    });
                }

                // Creamos las partes manualmente dentro de la transacción
                const partesCreadas = await ApelacionParte.bulkCreate(partesData, { 
                    transaction: t, 
                    returning: true 
                });

                // 3. Crear la Relación vinculando los IDs de las partes recién creadas
                const nuevaRelacion = await Relacion.create({
                    idApelacion: nuevaApelacion.id,
                    activo: data.activo ?? true,
                    // Asignamos los IDs basándonos en el orden o tipo de parte
                    idApelacionParteOfendido: partesCreadas[0]?.id,
                    idApelacionParteProcesado: partesCreadas[1]?.id
                }, { transaction: t });

                // 4. Crear los Delitos de esta relación
                if (rel.delitoRelaciones && Array.isArray(rel.delitoRelaciones)) {
                    const delitosData = rel.delitoRelaciones.map((dr: any) => ({
                        ...dr,
                        idRelacion: nuevaRelacion.id,
                        activo: data.activo ?? true
                    }));
                    await DelitoRelacion.bulkCreate(delitosData, { transaction: t });
                }
            }
        }

        await t.commit();
        
        // Retornamos la apelación completa (opcional: podrías hacer un getByFolio aquí)
        return nuevaApelacion;

    } catch (error) {
        if (t) await t.rollback();
        console.error("Error en Transacción:", error);
        throw error;
    }
}

static async listAnexos() {
        const catalogs = {
            anexo: CatAnexo,
            // materia: CatMateria,
        };

        const results = await Promise.all(
            Object.entries(catalogs).map(async ([key, entityClass]) => {
                // Paso 1: Obtener el repositorio de la entidad
                const repository = AppDataSource.getRepository(entityClass);

                // Paso 2: Realizar la búsqueda
                return await repository.find({
                    select: {
                        id: true,
                        activo: true,
                        descripcion: true
                    }
                });
            })
        );

        return Object.keys(catalogs).reduce((acc, key, index) => {
            acc[key] = results[index];
            return acc;
        }, {} as Record<string, any>);
    }

static async agregarAnexo(data: any) {
    // Iniciamos transacción por seguridad
    const t = await sequelize.transaction();

    try {
        const { idApelacion, anexos, activo } = data;

        if (!idApelacion) throw new Error("El ID de la apelación es obligatorio");
        if (!anexos || !Array.isArray(anexos)) throw new Error("Debe enviar un array de anexos");

        // Mapeamos los anexos para inyectar el IdTramite (idApelacion) y el estado Activo
        const anexosData = anexos.map((anexo: any) => ({
            ...anexo,
            idApelacion: idApelacion, // Se mapea a IdTramite en la BD
            activo: activo ?? true
        }));

        // Inserción múltiple
        const nuevosAnexos = await ApelacionAnexo.bulkCreate(anexosData, { 
            transaction: t,
            validate: true 
        });

        await t.commit();
        return nuevosAnexos;

    } catch (error) {
        if (t) await t.rollback();
        throw error;
    }
}
}