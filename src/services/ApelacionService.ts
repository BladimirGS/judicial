import { AppDataSource } from '../config/typeorm.config';
import { CatMateria } from '../entities/CatMateria.entity';
import { TipoApelacion } from '../entities/TipoApelacion.entity';
import { CatApelacion } from '../entities/CatApelacion.entity';
import { TipoEscrito } from '../entities/TipoEscrito.entity';
import { CatLocalidad } from '../entities/CatLocalidad.entity';
import { CatMunicipio } from '../entities/CatMunicipio.entity';
import { CatEtnia } from '../entities/CatEtnia.entity';
import { CatDelito } from '../entities/CatDelito.entity';
import { Apelacion } from '../entities/Apelacion.entity';
import { CatJuzgado } from '../entities/CatJuzgado.entity';
import { Relacion } from '../entities/Relacion.entity';
import { ApelacionParte } from '../entities/ApelacionParte.entity';
import { DelitoRelacion } from '../entities/DelitoRelacion.entity';
import { CatAnexo } from '../entities/CatAnexo.entity';
import { ApelacionAnexo } from '../entities/ApelacionAnexo.entity';
import { CatSala } from '../entities/CatSala.entity';
import { CatNomenclatura } from '../entities/CatNomenclatura.entity';
import { TipoParte } from '../entities/TipoParte.entity';

export class ApelacionService {

    static async getFormDataApelacion() {
        const catalogs: Record<string, any> = {
            materias: CatMateria,
            apelaciones: CatApelacion,
            tiposApelaciones: TipoApelacion,
            tiposEscritos: TipoEscrito,
            juzgados: CatJuzgado,
            municipios: CatMunicipio,
            localidades: CatLocalidad,
            etnias: CatEtnia,
            delitos: CatDelito
        };

        const results = await Promise.all(
            Object.entries(catalogs).map(async ([_, entityClass]) => {
                const repo = AppDataSource.getRepository(entityClass);

                return await repo.find({
                    select: {
                        id: true,
                        descripcion: true
                    },
                    where: { activo: true } 
                });
            })
        );

        // Objeto de respuesta
        return Object.keys(catalogs).reduce((acc, key, index) => {
            acc[key] = results[index];
            return acc;
        }, {} as Record<string, any>);
    }

    static async getByFolio(folio: string) {
        const repo = AppDataSource.getRepository(Apelacion);

        const apelacion = await repo.findOne({
            where: { folioOficialia: folio },
            // Seleccionamos solo las columnas necesarias de la tabla principal
            select: {
                id: true,
                folioOficialia: true,
                folioApelacion: true,
                expedienteCausa: true,
                fojas: true,
                esReposicion: true,
                fechaAuto: true,
                observaciones: true,
                asunto: true,
                lugarHechos: true
            },
            // Cargamos las relaciones anidadas (el árbol de la Toca)
            relations: {
                materia: true,
                tipoApelacion: true,
                tipoEscrito: true,
                catJuzgado: true,
                municipio: true,
                localidad: true,
                etnia: true,
                relaciones: {
                    ofendido: {
                        sexo: true,
                        tipoParte: true
                    },
                    procesado: {
                        sexo: true,
                        tipoParte: true
                    },
                    delitoRelaciones: {
                        delito: true
                    }
                }
            }
        });

        if (!apelacion) return null;

        // El mapeo de retorno para el Frontend
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

            // Relaciones directas
            materia: apelacion.materia?.descripcion ?? null,
            etnia: apelacion.etnia?.descripcion ?? null,
            tipoApelacion: apelacion.tipoApelacion?.descripcion ?? null,
            tipoEscrito: apelacion.tipoEscrito?.descripcion ?? null,
            juzgadoOrigen: apelacion.catJuzgado?.descripcion ?? null,
            municipio: apelacion.municipio?.descripcion ?? null,
            localidad: apelacion.localidad?.descripcion ?? null,

            // Mapeo de Relaciones
            relaciones: apelacion.relaciones?.map(r => ({
                id: r.id,
                ofendido: {
                    id: r.ofendido?.id,
                    nombre: r.ofendido?.nombre ?? null,
                    direccion: r.ofendido?.direccion ?? null,
                    menorEdad: r.ofendido?.menorEdad ?? false,
                    sexo: r.ofendido?.sexo?.descripcion ?? null,
                    tipoParte: r.ofendido?.tipoParte?.descripcion ?? null
                },
                procesado: {
                    id: r.procesado?.id,
                    nombre: r.procesado?.nombre ?? null,
                    direccion: r.procesado?.direccion ?? null,
                    menorEdad: r.procesado?.menorEdad ?? false,
                    sexo: r.procesado?.sexo?.descripcion ?? null,
                    tipoParte: r.procesado?.tipoParte?.descripcion ?? null
                },
                delitosRelacion: r.delitoRelaciones?.map(dr => ({
                    id: dr.id,
                    nombreDelito: dr.delito?.descripcion ?? null 
                })) ?? []
            })) ?? []
        };
    }

static async search(params: any) {
    const query = AppDataSource.getRepository(Apelacion)
        .createQueryBuilder("apelacion")
        // Traemos las relaciones principales para mostrar en la tabla/lista
        .leftJoinAndSelect("apelacion.sala", "sala")
        .leftJoinAndSelect("apelacion.nomenclatura", "nomenclatura")
        .leftJoinAndSelect("apelacion.tipoApelacion", "tipoApelacion")
        // Traemos el árbol de relaciones para el filtrado y detalle
        .leftJoinAndSelect("apelacion.relaciones", "rel")
        .leftJoinAndSelect("rel.ofendido", "ofendido")
        .leftJoinAndSelect("ofendido.sexo", "oSexe")
        .leftJoinAndSelect("ofendido.tipoParte", "oTipo")
        .leftJoinAndSelect("rel.procesado", "procesado")
        .leftJoinAndSelect("procesado.sexo", "pSexe")
        .leftJoinAndSelect("procesado.tipoParte", "pTipo")
        .leftJoinAndSelect("rel.delitoRelaciones", "dr")
        .leftJoinAndSelect("dr.delito", "delito");

    // --- Filtros Dinámicos ---
    if (params.folioOficialia) {
        query.andWhere("apelacion.folioOficialia LIKE :folio", { folio: `%${params.folioOficialia}%` });
    }

    if (params.idSala) {
        query.andWhere("sala.id = :idSala", { idSala: params.idSala });
    }

    if (params.idNomenclatura) {
        query.andWhere("nomenclatura.id = :idNom", { idNom: params.idNomenclatura });
    }

    if (params.idTipoApelacion) {
        query.andWhere("tipoApelacion.id = :idTipo", { idTipo: params.idTipoApelacion });
    }

    if (params.folioApelacion) {
        query.andWhere("apelacion.folioApelacion LIKE :fApel", { fApel: `%${params.folioApelacion}%` });
    }

    if (params.expedienteCausa) {
        query.andWhere("apelacion.expedienteCausa LIKE :causa", { causa: `%${params.expedienteCausa}%` });
    }

if (params.nombreParte) {
    query.andWhere(qb => {
        const sub = qb.subQuery()
            .select("1")
            .from(Relacion, "rel2")
            .leftJoin("rel2.ofendido", "o2")
            .leftJoin("rel2.procesado", "p2")
            .where("rel2.idApelacion = apelacion.id")
            .andWhere("(o2.nombre LIKE :parte OR p2.nombre LIKE :parte)")
            .getQuery();

        return `EXISTS ${sub}`;
    }).setParameter("parte", `%${params.nombreParte}%`);
}

    // Ejecutamos la consulta
    const resultados = await query.getMany();

    // Mapeamos los resultados para que el Controller entregue JSON limpio
    return resultados.map(apelacion => ({
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

        // Relaciones directas
        materia: apelacion.materia?.descripcion ?? null,
        etnia: apelacion.etnia?.descripcion ?? null,
        tipoApelacion: apelacion.tipoApelacion?.descripcion ?? null,
        tipoEscrito: apelacion.tipoEscrito?.descripcion ?? null,
        juzgadoOrigen: apelacion.catJuzgado?.descripcion ?? null,
        municipio: apelacion.municipio?.descripcion ?? null,
        localidad: apelacion.localidad?.descripcion ?? null,
        sala: apelacion.sala?.descripcion ?? null,
        nomenclatura: apelacion.nomenclatura?.descripcion ?? null,

        // Resumen de partes y delitos para la vista de lista
relaciones: apelacion.relaciones?.flatMap(r => {
    const partes: any[] = [];

    if (r.ofendido) {
        partes.push({
            tipoParte: r.ofendido.tipoParte?.descripcion ?? "OFENDIDO",
            nombre: r.ofendido.nombre ?? null,
            direccion: r.ofendido.direccion ?? null,
            menorEdad: Boolean(r.ofendido.menorEdad),
            sexo: r.ofendido.sexo?.descripcion ?? null
        });
    }

    if (r.procesado) {
        partes.push({
            tipoParte: r.procesado.tipoParte?.descripcion ?? "PROCESADO",
            nombre: r.procesado.nombre ?? null,
            direccion: r.procesado.direccion ?? null,
            menorEdad: Boolean(r.procesado.menorEdad),
            sexo: r.procesado.sexo?.descripcion ?? null
        });
    }

    return partes;
}) ?? []
    }));
}


    static async create(data: any) {
        // 1. Definimos qué campos permitimos para la Apelación
        const apelacionFields = [
            'idSala', 'idMateria', 'folioOficialia', 'idNomenclatura', 'folioApelacion',
            'idApelacion', 'idTipoApelacion', 'fechaAuto', 'expedienteCausa', 'idTipoEscrito',
            'folioOficio', 'fojas', 'expedienteAcumulado', 'idJuzgado', 'observaciones',
            'fechaHoraRecepcion', 'fechaHoraIngresoJuz', 'certificacion', 'esReposicion', 
            'idMunicipio', 'idLocalidad', 'idEtnia', 'lugarHechos', 'asunto'
        ];

        // Limpiamos el objeto principal
        const cleanApelacion = Object.keys(data)
            .filter(key => apelacionFields.includes(key))
            .reduce((obj, key) => { obj[key] = data[key]; return obj; }, {} as any);

        // Forzamos el valor por defecto antes de crear la entidad ---------------------------------
        cleanApelacion.idSala = 1;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Guardar Apelación limpia
            const nuevaApelacion = queryRunner.manager.create(Apelacion, cleanApelacion);
            const apelacionGuardada = await queryRunner.manager.save(nuevaApelacion);

            // 3. Procesar Relaciones con validación interna
            if (data.relaciones && Array.isArray(data.relaciones)) {
                for (const rel of data.relaciones) {
                    
                    // Limpieza de datos de las Partes
                    const crearParte = async (parteData: any) => {
                        if (!parteData?.nombre) return null;
                        return await queryRunner.manager.save(
                            queryRunner.manager.create(ApelacionParte, {
                                nombre: parteData.nombre,
                                direccion: parteData.direccion,
                                menorEdad: parteData.menorEdad ?? false,
                                idTipoParte: parteData.idTipoParte,
                                idSexo: parteData.idSexo,
                                idApelacion: apelacionGuardada.id,
                            })
                        );
                    };

                    const ofendido = await crearParte(rel.ofendido);
                    const procesado = await crearParte(rel.procesado);

                    // Solo creamos la relación si al menos hay una parte involucrada
                    if (ofendido && procesado) {
                        const nuevaRelacion = await queryRunner.manager.save(
                            queryRunner.manager.create(Relacion, {
                                idApelacion: apelacionGuardada.id,
                                idApelacionParteOfendido: ofendido?.id,
                                idApelacionParteProcesado: procesado?.id,
                            })
                        );

                        // 4. Delitos (Solo permitimos idCatDelito)
                        if (rel.delitoRelaciones && Array.isArray(rel.delitoRelaciones)) {
                            const delitosData = rel.delitoRelaciones
                                .filter((dr: any) => dr.idDelito) // Validación: que traiga ID de delito
                                .map((dr: any) => queryRunner.manager.create(DelitoRelacion, {
                                    idDelito: dr.idDelito,
                                    idRelacion: nuevaRelacion.id,
                                }));
                            
                            if (delitosData.length > 0) await queryRunner.manager.save(delitosData);
                        }
                    }
                }
            }

            await queryRunner.commitTransaction();
            return apelacionGuardada;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

static async listAnexos() {
        const catalogs = {
            anexo: CatAnexo,
        };

        const results = await Promise.all(
            Object.entries(catalogs).map(async ([key, entityClass]) => {
                // Obtener el repositorio de la entidad
                const repository = AppDataSource.getRepository(entityClass);

                // Realizar la búsqueda
                return await repository.find({
                    select: {
                        id: true,
                        descripcion: true
                    },
                    where: { activo: true } 
                });
            })
        );

        return Object.keys(catalogs).reduce((acc, key, index) => {
            acc[key] = results[index];
            return acc;
        }, {} as Record<string, any>);
    }

    static async agregarAnexo(data: any) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { idApelacion, anexos } = data;

            // Validaciones iniciales
            if (!idApelacion) throw new Error("El ID de la apelación es obligatorio");
            if (!anexos || !Array.isArray(anexos)) throw new Error("Debe enviar un array de anexos");

            // Mapeamos los datos a instancias de la Entidad
            const anexosEntities = anexos.map((anexo: any) => {
                return queryRunner.manager.create(ApelacionAnexo, {
                    ...anexo,
                    idApelacion: idApelacion,
                });
            });

            // Inserción múltiple (Bulk Save)
            // TypeORM gestionará la eficiencia de la inserción en SQL Server
            const nuevosAnexos = await queryRunner.manager.save(anexosEntities);

            await queryRunner.commitTransaction();
            return nuevosAnexos;

        } catch (error) {
            // Revertimos en caso de error
            await queryRunner.rollbackTransaction();
            console.error("Error al agregar anexos:", error);
            throw error;
        } finally {
            // Siempre liberamos el runner
            await queryRunner.release();
        }
    }

    static async getFormDataBuscador() {
        const catalogs: Record<string, any> = {
            sala: CatSala,
            nomenclatura: CatNomenclatura,
            tiposApelaciones: TipoApelacion,
            tiposEscritos: TipoEscrito,
        };

        const results = await Promise.all(
            Object.entries(catalogs).map(async ([_, entityClass]) => {
                const repo = AppDataSource.getRepository(entityClass);

                return await repo.find({
                    select: {
                        id: true,
                        descripcion: true
                    },
                    where: { activo: true } 
                });
            })
        );

        // Objeto de respuesta
        return Object.keys(catalogs).reduce((acc, key, index) => {
            acc[key] = results[index];
            return acc;
        }, {} as Record<string, any>);
    }
}