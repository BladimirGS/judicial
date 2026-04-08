export interface ApelacionDetailDTO {
    id: number;
    folioOficialia: string;
    folioApelacion: string;
    expedienteCausa: string;
    fojas: number;
    esReposicion: boolean;
    fechaAuto: Date;
    observaciones: string;
    asunto: string;
    lugarHechos: string;
    materia: string;
    tipoApelacion: string;
    tipoEscrito: string;
    juzgadoOrigen: string;
    municipio: string;
    localidad: string;
    etnia: string;
}