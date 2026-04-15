import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { CatSala } from "./CatSala.entity";
import { CatMateria } from "./CatMateria.entity";
import { CatNomenclatura } from "./CatNomenclatura.entity";
import { CatApelacion } from "./CatApelacion.entity";
import { TipoApelacion } from "./TipoApelacion.entity";
import { TipoEscrito } from "./TipoEscrito.entity";
import { CatJuzgado } from "./CatJuzgado.entity";
import { CatMunicipio } from "./CatMunicipio.entity";
import { CatLocalidad } from "./CatLocalidad.entity";
import { CatEtnia } from "./CatEtnia.entity";
import { ApelacionParte } from "./ApelacionParte.entity";
import { Relacion } from "./Relacion.entity";

@Entity({ name: 'OFA_Apelaciones' })
export class Apelacion {

    @PrimaryGeneratedColumn({ name: 'IdApelacion' })
    id!: number;

    @Column({ name: 'FolioOficialia', length: 9, nullable: true })
    folioOficialia!: string;

    @Column({ name: 'FolioApelacion', length: 25, nullable: true })
    folioApelacion!: string;

    @Column({ name: 'FolioApelacionAnterior', length: 25, nullable: true })
    folioApelacionAnterior!: string;

    @Column({ name: 'FechaAuto', type: 'datetime', nullable: true })
    fechaAuto!: Date;

    @Column({ name: 'ExpedienteCausa', length: 10, nullable: true })
    expedienteCausa!: string;

    @Column({ name: 'FolioOficio', length: 35, nullable: true })
    folioOficio!: string;

    @Column({ name: 'Fojas', type: 'int', nullable: true })
    fojas!: number;

    @Column({ name: 'ExpedienteAcumulado', length: 10, nullable: true })
    expedienteAcumulado!: string;

    @Column({ name: 'Observaciones', length: 2500, nullable: true })
    observaciones!: string;

    @Column({ name: 'FechaHoraRecepcion', type: 'datetime', nullable: true })
    fechaHoraRecepcion!: Date;

    @Column({ name: 'FechaHoraRecepcionAnterior', type: 'datetime', nullable: true })
    fechaHoraRecepcionAnterior!: Date;

    @Column({ name: 'FechaHoraIngresoJuz', type: 'datetime', nullable: true })
    fechaHoraIngresoJuz!: Date;

    @Column({ name: 'Certificacion', type: 'int', nullable: true })
    certificacion!: number;

    @Column({ name: 'EsReposicion', type: 'bit', default: false })
    esReposicion!: boolean;

    @Column({ name: 'Activo', type: 'bit', default: true })
    activo!: boolean;

    @Column({ name: 'LugarHechos', length: 200, nullable: true })
    lugarHechos!: string;

    @Column({ name: 'Asunto', length: 300, nullable: true })
    asunto!: string;

    @Column({ name: 'IdMagistradoAsignado', type: 'int', nullable: true })
    idMagistradoAsignado!: number;

    @Column({ name: 'IdSalaAnterior', type: 'int', nullable: true })
    idSalaAnterior!: number;

    // Relaciones ManyToOne

    @ManyToOne(() => CatSala)
    @JoinColumn({ name: 'IdSala' })
    sala!: CatSala;

    @ManyToOne(() => CatMateria)
    @JoinColumn({ name: 'IdCatMateria' })
    materia!: CatMateria;

    @ManyToOne(() => CatNomenclatura)
    @JoinColumn({ name: 'IdCatNomenclatura' })
    nomenclatura!: CatNomenclatura;

    @ManyToOne(() => CatApelacion)
    @JoinColumn({ name: 'IdCAtApelacion' })
    catApelacion!: CatApelacion;

    @ManyToOne(() => TipoApelacion)
    @JoinColumn({ name: 'IdCatTipoApelacion' })
    tipoApelacion!: TipoApelacion;

    @ManyToOne(() => TipoEscrito)
    @JoinColumn({ name: 'IdCatTipoEscrito' })
    tipoEscrito!: TipoEscrito;

    @ManyToOne(() => CatJuzgado)
    @JoinColumn({ name: 'IdCatJuzgadoOrigen' })
    catJuzgado!: CatJuzgado;

    @ManyToOne(() => CatMunicipio)
    @JoinColumn({ name: 'IdCAtMunicipio' })
    municipio!: CatMunicipio;

    @ManyToOne(() => CatLocalidad)
    @JoinColumn({ name: 'IdCAtLocalidad' })
    localidad!: CatLocalidad;

    @ManyToOne(() => CatEtnia)
    @JoinColumn({ name: 'IdEtnia' })
    etnia!: CatEtnia;

    // Relaciones OneToMany

    @OneToMany(() => ApelacionParte, (parte) => parte.apelacion)
    apelacionPartes!: ApelacionParte[];

    @OneToMany(() => Relacion, (rel) => rel.apelacion)
    relaciones!: Relacion[];

    // Foreign Keys
    @Column({ name: 'IdSala' }) idSala!: number;
    @Column({ name: 'IdCatMateria' }) idMateria!: number;
    @Column({ name: 'IdCatNomenclatura' }) idNomenclatura!: number;
    @Column({ name: 'IdCAtApelacion' }) idApelacion!: number;
    @Column({ name: 'IdCatTipoApelacion' }) idTipoApelacion!: number;
    @Column({ name: 'IdCatTipoEscrito' }) idTipoEscrito!: number;
    @Column({ name: 'IdCatJuzgadoOrigen' }) idJuzgado!: number;
    @Column({ name: 'IdCAtMunicipio' }) idMunicipio!: number;
    @Column({ name: 'IdCAtLocalidad' }) idLocalidad!: number;
    @Column({ name: 'IdEtnia' }) idEtnia!: number;
}