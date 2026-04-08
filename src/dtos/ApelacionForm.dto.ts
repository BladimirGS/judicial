import { CatalogItemDTO } from './CatalogItem.dto';

export interface ApelacionFormDTO {
    materias: CatalogItemDTO[];
    apelaciones: CatalogItemDTO[];
    tiposApelaciones: CatalogItemDTO[];
    tiposEscritos: CatalogItemDTO[];
    juzgados: CatalogItemDTO[];
    municipios: CatalogItemDTO[];
    localidades: CatalogItemDTO[];
    etnias: CatalogItemDTO[];
}