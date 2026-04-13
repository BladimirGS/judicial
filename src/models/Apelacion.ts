import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript"
import CatMateria from "./CatMateria"
import CatNomenclatura from "./CatNomenclatura"
import CatApelacion from "./CatApelacion"
import TipoApelacion from "./TipoApelacion"
import TipoEscrito from "./TipoEscrito"
import CatMunicipio from "./CatMunicipio"
import CatLocalidad from "./CatLocalidad"
import CatEtnia from "./CatEtnia"
import CatJuzgado from "./CatJuzgado"
import ApelacionParte from "./ApelacionParte"
import Relacion from "./Relacion"

@Table({
    tableName: 'OFA_Apelaciones'
})

class Apelacion extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'IdApelacion'
    })
    declare id: number

    @Column({
        type: DataType.INTEGER,
        field: 'IdSala'
    })
    declare idSala: number

    @Column({
        type: DataType.INTEGER,
        field: 'IdSalaAnterior'
    })
    declare idSalaAnterior: number

    @ForeignKey(() => CatMateria)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatMateria'
    })
    declare idMateria: number

    @Column({
        type: DataType.STRING(9),
        field: 'FolioOficialia'
    })
    declare folioOficialia: string

    @ForeignKey(() => CatNomenclatura)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatNomenclatura'
    })
    declare idNomenclatura: number

    @Column({
        type: DataType.STRING(25),
        field: 'FolioApelacion'
    })
    declare folioApelacion: string

    @Column({
        type: DataType.STRING(25),
        field: 'FolioApelacionAnterior'
    })
    declare folioApelacionAnterior: string

    @ForeignKey(() => CatApelacion)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCAtApelacion'
    })
    declare idApelacion: number

    @ForeignKey(() => TipoApelacion)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatTipoApelacion'
    })
    declare idTipoApelacion: number

    @Column({
        type: DataType.DATE,
        field: 'FechaAuto'
    })
    declare fechaAuto: Date

    @Column({
        type: DataType.STRING(10),
        field: 'ExpedienteCausa'
    })
    declare expedienteCausa: string

    @ForeignKey(() => TipoEscrito)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatTipoEscrito'
    })
    declare idTipoEscrito: number

    @Column({
        type: DataType.STRING(35),
        field: 'FolioOficio'
    })
    declare folioOficio: string

    @Column({
        type: DataType.INTEGER,
        field: 'Fojas'
    })
    declare fojas: number

    @Column({
        type: DataType.STRING(10),
        field: 'ExpedienteAcumulado'
    })
    declare expedienteAcumulado: string

    @ForeignKey(() => CatJuzgado)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatJuzgadoOrigen'
    })
    declare idJuzgado: number

    @Column({
        type: DataType.STRING(2500),
        field: 'Observaciones'
    })
    declare observaciones: string

    @Column({
        type: DataType.DATE,
        field: 'FechaHoraRecepcion'
    })
    declare fechaHoraRecepcion: Date

    @Column({
        type: DataType.DATE,
        field: 'FechaHoraRecepcionAnterior'
    })
    declare fechaHoraRecepcionAnterior: Date

    @Column({
        type: DataType.DATE,
        field: 'FechaHoraIngresoJuz'
    })
    declare fechaHoraIngresoJuz: Date

    @Column({
        type: DataType.INTEGER,
        field: 'Certificacion'
    })
    declare certificacion: number

    @Column({
        type: DataType.BOOLEAN,
        field: 'EsReposicion'
    })
    declare esReposicion: boolean

    @Column({
        type: DataType.BOOLEAN,
        field: 'Activo'
    })
    declare activo: boolean

    @ForeignKey(() => CatMunicipio)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCAtMunicipio'
    })
    declare idMunicipio: number

    @ForeignKey(() => CatLocalidad)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCAtLocalidad'
    })
    declare idLocalidad: number

    @Column({
        type: DataType.STRING(200),
        field: 'LugarHechos'
    })
    declare lugarHechos: string

    @Column({
        type: DataType.STRING(300),
        field: 'Asunto'
    })
    declare asunto: string

    @ForeignKey(() => CatEtnia)
    @Column({
        type: DataType.INTEGER,
        field: 'IdEtnia'
    })
    declare idEtnia: number

    @Column({
        type: DataType.INTEGER,
        field: 'IdMagistradoAsignado'
    })
    declare idMagistradoAsignado: number


    @BelongsTo(() => CatMateria)
    declare materia: CatMateria;

    @BelongsTo(() => CatNomenclatura) 
    declare nomenclatura: CatNomenclatura;

    @BelongsTo(() => CatApelacion) 
    declare catApelacion: CatApelacion;

    @BelongsTo(() => TipoApelacion)
    declare tipoApelacion: TipoApelacion;

    @BelongsTo(() => TipoEscrito)
    declare tipoEscrito: TipoEscrito;

    @BelongsTo(() => CatJuzgado)
    declare catJuzgado: CatJuzgado;

    @BelongsTo(() => CatMunicipio)
    declare municipio: CatMunicipio;

    @BelongsTo(() => CatLocalidad)
    declare localidad: CatLocalidad;

    @BelongsTo(() => CatEtnia)
    declare etnia: CatEtnia;

    // @HasMany(() => ApelacionParte)
    // declare apelacionPartes: ApelacionParte[];

    @HasMany(() => Relacion)
    declare relaciones: Relacion[];
}

export default Apelacion