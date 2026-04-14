import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: 'OFA_CAT_Materias' }) 
export class CatMateria extends BaseEntity {

    @PrimaryGeneratedColumn({ name: 'IdCatMateria' })
    id!: number;

    @Column({ 
        name: 'Descripcion', 
        type: 'varchar', 
        length: 25, 
        nullable: false 
    })
    descripcion!: string;

    @Column({ 
        name: 'Activo', 
        type: 'bit', 
        default: true 
    })
    activo!: boolean;
}