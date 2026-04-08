import Apelacion from '../models/Apelacion';
import { ApelacionDetailDTO } from '../dtos/ApelacionDetail.dto';
import { CatalogItemDTO } from '../dtos/CatalogItem.dto';

export class ApelacionMapper {
    
    /**
     * NUEVO: Transforma cualquier lista de modelos de catálogo al DTO estándar.
     */
    static toCatalogDTO(models: any[]): CatalogItemDTO[] {
        return models.map(item => ({
            id: Number(item.id || item.IdMateria || item.IdEtnia  || 0),
            descripcion: String(item.descripcion || ''),
            activo: Boolean(item.activo ?? true)
        }));
    }

    /**
     * Transforma un modelo de Sequelize (con sus includes) 
     * al DTO de detalle para el usuario.
     */
    static toDetailDTO(model: Apelacion): ApelacionDetailDTO {
        return {
            id: model.id,
            folioOficialia: model.folioOficialia,
            folioApelacion: model.folioApelacion,
            expedienteCausa: model.expedienteCausa,
            fojas: model.fojas,
            esReposicion: model.esReposicion,
            fechaAuto: model.fechaAuto,
            observaciones: model.observaciones,
            asunto: model.asunto,
            lugarHechos: model.lugarHechos,
            
            // Acceso seguro a las relaciones
            materia: model.materia?.descripcion || 'N/A',
            etnia: model.etnia?.descripcion || 'N/A',
            tipoApelacion: model.tipoApelacion?.descripcion || 'N/A',
            tipoEscrito: model.tipoEscrito?.descripcion || 'N/A',
            juzgadoOrigen: model.catJuzgado?.descripcion || 'N/A',
            municipio: model.municipio?.descripcion || 'N/A',
            localidad: model.localidad?.descripcion || 'N/A'
        };
    }

    static toDetailDTOList(models: Apelacion[]): ApelacionDetailDTO[] {
        return models.map(model => this.toDetailDTO(model));
    }
}