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
import { CatSexo } from '../entities/CatSexo.entity';
import { TipoParte } from '../entities/TipoParte.entity';
import { DelitoRelacion } from '../entities/DelitoRelacion.entity';
import { CatAnexo } from '../entities/CatAnexo.entity';
import { Like } from 'typeorm';
import { ApelacionAnexo } from '../entities/ApelacionAnexo.entity';

export class ApelacionService {

    static async getFormData() {
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
                        activo: true,
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
                etnia: true,
                tipoApelacion: true,
                tipoEscrito: true,
                catJuzgado: true,
                municipio: true,
                localidad: true,
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
        .leftJoinAndSelect("apelacion.materia", "materia")
        .leftJoinAndSelect("apelacion.catJuzgado", "juzgado")
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
    if (params.id) {
        query.andWhere("apelacion.id = :id", { id: params.id });
    }

    if (params.folioOficialia) {
        query.andWhere("apelacion.folioOficialia LIKE :folio", { folio: `%${params.folioOficialia}%` });
    }

    if (params.folioApelacion) {
        query.andWhere("apelacion.folioApelacion LIKE :fApel", { fApel: `%${params.folioApelacion}%` });
    }

    if (params.expedienteCausa) {
        query.andWhere("apelacion.expedienteCausa LIKE :causa", { causa: `%${params.expedienteCausa}%` });
    }

    if (params.nombreParte) {
        query.andWhere("(ofendido.nombre LIKE :parte OR procesado.nombre LIKE :parte)", { parte: `%${params.nombreParte}%` });
    }

    if (params.nombreDelito) {
        query.andWhere("delito.descripcion LIKE :delitoNom", { delitoNom: `%${params.nombreDelito}%` });
    }

    // Ejecutamos la consulta
    const resultados = await query.getMany();

    // Mapeamos los resultados para que el Controller entregue JSON limpio
    return resultados.map(apelacion => ({
        id: apelacion.id,
        folioOficialia: apelacion.folioOficialia,
        folioApelacion: apelacion.folioApelacion,
        expedienteCausa: apelacion.expedienteCausa,
        fechaAuto: apelacion.fechaAuto,
        asunto: apelacion.asunto,
        
        // Descripciones de catálogos nivel 1
        materia: apelacion.materia?.descripcion ?? null,
        juzgado: apelacion.catJuzgado?.descripcion ?? null,

        // Resumen de partes y delitos para la vista de lista
        relaciones: apelacion.relaciones?.map(r => ({
            id: r.id,
            ofendido: {
                id: r.ofendido?.id,
                nombre: r.ofendido?.nombre ?? null,
                sexo: r.ofendido?.sexo?.descripcion ?? null
            },
            procesado: {
                id: r.procesado?.id,
                nombre: r.procesado?.nombre ?? null,
                sexo: r.procesado?.sexo?.descripcion ?? null
            },
            delitos: r.delitoRelaciones?.map(dr => dr.delito?.descripcion ?? null) ?? []
        })) ?? []
    }));
}

    static async create(data: any) {
        // Usamos el queryRunner para manejar la transacción manualmente
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Crear la instancia de Apelación
            // .create() de TypeORM solo crea la instancia en memoria, no guarda en DB aún
            const nuevaApelacion = queryRunner.manager.create(Apelacion, {
                ...data,
                activo: data.activo ?? true
            });
            
            // Guardamos para obtener el ID real de SQL Server
            const apelacionGuardada = await queryRunner.manager.save(nuevaApelacion);

            // 2. Procesar Relaciones
            if (data.relaciones && Array.isArray(data.relaciones)) {
                for (const rel of data.relaciones) {
                    
                    // Crear Partes (Ofendido)
                    let ofendido = null;
                    if (rel.ofendido) {
                        ofendido = await queryRunner.manager.save(
                            queryRunner.manager.create(ApelacionParte, {
                                ...rel.ofendido,
                                idApelacion: apelacionGuardada.id,
                                activo: data.activo ?? true,
                                menorEdad: rel.ofendido.menorEdad ?? false
                            })
                        );
                    }

                    // Crear Partes (Procesado)
                    let procesado = null;
                    if (rel.procesado) {
                        procesado = await queryRunner.manager.save(
                            queryRunner.manager.create(ApelacionParte, {
                                ...rel.procesado,
                                idApelacion: apelacionGuardada.id,
                                activo: data.activo ?? true,
                                menorEdad: rel.procesado.menorEdad ?? false
                            })
                        );
                    }

                    // 3. Crear la Relación vinculando los IDs recién generados
                    const nuevaRelacion = await queryRunner.manager.save(
                        queryRunner.manager.create(Relacion, {
                            idApelacion: apelacionGuardada.id,
                            idApelacionParteOfendido: ofendido?.id,
                            idApelacionParteProcesado: procesado?.id,
                            activo: data.activo ?? true
                        })
                    );

                    // 4. Crear los Delitos asociados a esta relación
                    if (rel.delitoRelaciones && Array.isArray(rel.delitoRelaciones)) {
                        const delitosParaGuardar = rel.delitoRelaciones.map((dr: any) => 
                            queryRunner.manager.create(DelitoRelacion, {
                                ...dr,
                                idRelacion: nuevaRelacion.id,
                                activo: data.activo ?? true
                            })
                        );
                        await queryRunner.manager.save(delitosParaGuardar);
                    }
                }
            }

            // Confirmamos los cambios en la BD
            await queryRunner.commitTransaction();
            
            // Opcional: Retornar la apelación con su ID generado
            return apelacionGuardada;

        } catch (error) {
            // Si algo falla, revertimos todo (Atomacidad)
            await queryRunner.rollbackTransaction();
            console.error("Error en Transacción TypeORM:", error);
            throw error;
        } finally {
            // Liberamos el queryRunner
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
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { idApelacion, anexos, activo } = data;

            // Validaciones iniciales
            if (!idApelacion) throw new Error("El ID de la apelación es obligatorio");
            if (!anexos || !Array.isArray(anexos)) throw new Error("Debe enviar un array de anexos");

            // Mapeamos los datos a instancias de la Entidad
            const anexosEntities = anexos.map((anexo: any) => {
                return queryRunner.manager.create(ApelacionAnexo, {
                    ...anexo,
                    idApelacion: idApelacion, // Mapeado a IdTramite en tu Entity
                    activo: activo ?? true
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

}