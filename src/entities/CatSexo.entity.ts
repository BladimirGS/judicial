import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'OFA_CAT_Sexo' })
export class CatSexo {

    @PrimaryGeneratedColumn({ name: 'IdCatSexo' })
    id!: number;

    @Column({ 
        name: 'Descripcion', 
        type: 'varchar', 
        length: 15, 
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