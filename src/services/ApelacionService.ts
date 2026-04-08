import CatMateria from '../models/CatMateria';
import CatJuzgados from '../models/CatJuzgado';
import CatApelacion from '../models/CatApelacion';
import TipoApelacion from '../models/TipoApelacion';
import TipoEscrito from '../models/TipoEscrito';
import CatMunicipio from '../models/CatMunicipio';
import CatLocalidad from '../models/CatLocalidad';
import CatEtnia from '../models/CatEtnia';
import Apelacion from '../models/Apelacion';

// Importamos los DTOs y el Mapper
import { ApelacionFormDTO } from '../dtos/ApelacionForm.dto';
import { ApelacionDetailDTO } from '../dtos/ApelacionDetail.dto';
import { ApelacionMapper } from '../mappers/ApelacionMapper';

export class ApelacionService {
    
    // Obtiene todos los catálogos necesarios para el formulario de captura.
    static async getCaptureFormData(): Promise<ApelacionFormDTO> {
        // Definimos los atributos que queremos traer de cada tabla de catálogo
        const queryOptions = { 
            attributes: ['id', 'descripcion', 'Activo'] // Ajusta 'Activo' según tu modelo
        };

        const [
            materias, 
            apelaciones, 
            tiposApelaciones, 
            tiposEscritos, 
            juzgados, 
            municipios, 
            localidades, 
            etnias
        ] = await Promise.all([
            CatMateria.findAll(queryOptions),
            CatApelacion.findAll(queryOptions),
            TipoApelacion.findAll(queryOptions),
            TipoEscrito.findAll(queryOptions),
            CatJuzgados.findAll(queryOptions),
            CatMunicipio.findAll(queryOptions),
            CatLocalidad.findAll(queryOptions),
            CatEtnia.findAll(queryOptions),
        ]);

        // Usamos el Mapper para limpiar los datos
        return {
            materias: ApelacionMapper.toCatalogDTO(materias),
            apelaciones: ApelacionMapper.toCatalogDTO(apelaciones),
            tiposApelaciones: ApelacionMapper.toCatalogDTO(tiposApelaciones),
            tiposEscritos: ApelacionMapper.toCatalogDTO(tiposEscritos),
            juzgados: ApelacionMapper.toCatalogDTO(juzgados),
            municipios: ApelacionMapper.toCatalogDTO(municipios),
            localidades: ApelacionMapper.toCatalogDTO(localidades),
            etnias: ApelacionMapper.toCatalogDTO(etnias)
        };
    }

    // Busca una apelación por su ID y retorna sus detalles con nombres de catálogos.

    static async getByFolio(folio: string): Promise<ApelacionDetailDTO | null> {
        const apelacion = await Apelacion.findOne({
            where: { folioOficialia: folio }, // Buscamos por el campo de la BD
            include: { all: true } 
        });

        if (!apelacion) return null;

        return ApelacionMapper.toDetailDTO(apelacion);
    }
}