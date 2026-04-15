import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'OFA_CAT_Juzgados' })
export class CatJuzgado {

    @PrimaryGeneratedColumn({ name: 'IdCatJuzgado' })
    id!: number;

    @Column({ 
        name: 'Descripcion', 
        type: 'varchar', 
        length: 25, 
        nullable: true 
    })
    descripcion!: string;

    @Column({ 
        name: 'Activo', 
        type: 'bit', 
        default: true 
    })
    activo!: boolean;
}