import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Apelacion } from "./Apelacion.entity";
import { ApelacionParte } from "./ApelacionParte.entity";
import { DelitoRelacion } from "./DelitoRelacion.entity";

@Entity({ name: 'OFA_Relaciones' })
export class Relacion {

    @PrimaryGeneratedColumn({ name: 'IdRelacion' })
    id!: number;

    @Column({ 
        name: 'Activo', 
        type: 'bit', 
        default: true 
    })
    activo: boolean = true;

    // Relaciones ManyToOne

    @ManyToOne(() => Apelacion)
    @JoinColumn({ name: 'IdApelacion' })
    apelacion!: Apelacion;

    @ManyToOne(() => ApelacionParte)
    @JoinColumn({ name: 'IdApelacionParteOfendido' })
    ofendido!: ApelacionParte;

    @ManyToOne(() => ApelacionParte)
    @JoinColumn({ name: 'IdApelacionParteProcesado' })
    procesado!: ApelacionParte;

    // Relaciones OneToMany

    @OneToMany(() => DelitoRelacion, (delitoRelacion) => delitoRelacion.relacion)
    delitoRelaciones!: DelitoRelacion[];

    // Columnas de IDs planos

    @Column({ name: 'IdApelacion' })
    idApelacion!: number;

    @Column({ name: 'IdApelacionParteOfendido' })
    idApelacionParteOfendido!: number;

    @Column({ name: 'IdApelacionParteProcesado' })
    idApelacionParteProcesado!: number;
}