import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Relacion } from "./Relacion.entity";
import { CatDelito } from "./CatDelito.entity";

@Entity({ name: 'OFA_DelitosRelaciones' })
export class DelitoRelacion {

    @PrimaryGeneratedColumn({ name: 'IdDelitoRelacion' })
    id!: number;

    @Column({ 
        name: 'Activo', 
        type: 'bit', 
        default: true 
    })
    activo: boolean = true;

    // --- Relaciones ---

    // Muchas "DelitoRelacion" pertenecen a una "Relacion"
    @ManyToOne(() => Relacion)
    @JoinColumn({ name: 'IdRelacion' })
    relacion!: Relacion;

    // Muchas "DelitoRelacion" pertenecen a un "Delito"
    @ManyToOne(() => CatDelito)
    @JoinColumn({ name: 'IdCatDelito' })
    delito!: CatDelito;

    // Si necesitas acceder al ID plano (opcional en TypeORM, pero útil)
    @Column({ name: 'IdRelacion' })
    idRelacion!: number;

    @Column({ name: 'IdCatDelito' })
    idDelito!: number;
}