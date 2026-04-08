export interface CreateApelacionDTO {
    idSala: number;
    idCatMateria: number;
    folioOficialia: string;
    idCatNomenclatura: number;
    folioApelacion: string;
    idCAtApelacion: number;
    idCatTipoApelacion: number;
    fechaAuto: Date;
    expedienteCausa: string;
    idCatTipoEscrito: number;
    folioOficio: string;
    fojas: number;
    expedienteAcumulado: string;
    idCarJuzgadoOrigen: number;
    observaciones: string;
    fechaHoraRecepcion: Date;
    esReposicion: boolean;
    idCatMunicipio: number;
    idCatLocalidad: number;
    lugarHechos: string;
    asunto: string;
    idEtnia: number;
}