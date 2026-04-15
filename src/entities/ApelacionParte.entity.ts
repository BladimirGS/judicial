import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Apelacion } from "./Apelacion.entity";
import { TipoParte } from "./TipoParte.entity";
import { CatSexo } from "./CatSexo.entity";
import { Relacion } from "./Relacion.entity";

@Entity({ name: 'OFA_ApelacionPartes' })
export class ApelacionParte {

    @PrimaryGeneratedColumn({ name: 'IdApelacionParte' })
    id!: number;

    @Column({ 
        name: 'Nombre', 
        type: 'varchar', 
        length: 300, 
        nullable: true 
    })
    nombre!: string;

    @Column({ 
        name: 'Direccion', 
        type: 'varchar', 
        length: 25, 
        nullable: true 
    })
    direccion!: string;

    @Column({ 
        name: 'MenorEdad', 
        type: 'bit', 
        default: false 
    })
    // Corregido a boolean para coincidir con el tipo físico
    menorEdad!: boolean;

    @Column({ 
        name: 'Activo', 
        type: 'bit', 
        default: true 
    })
    activo!: boolean;

    // --- Relaciones ManyToOne (BelongsTo) ---

    @ManyToOne(() => Apelacion)
    @JoinColumn({ name: 'IdApelacion' })
    apelacion!: Apelacion;

    @ManyToOne(() => TipoParte)
    @JoinColumn({ name: 'IdCatTipoParte' })
    tipoParte!: TipoParte;

    @ManyToOne(() => CatSexo)
    @JoinColumn({ name: 'IdCatSexo' })
    sexo!: CatSexo;

    // --- Relaciones OneToMany (HasMany) ---

    @OneToMany(() => Relacion, (relacion) => relacion.ofendido) // O procesado, según la lógica de navegación
    relaciones!: Relacion[];

    // --- Columnas de IDs planos ---

    @Column({ name: 'IdApelacion' })
    idApelacion!: number;

    @Column({ name: 'IdCatTipoParte' })
    idTipoParte!: number;

    @Column({ name: 'IdCatSexo' })
    idSexo!: number;
}