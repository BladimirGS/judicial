import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: 'OFA_CAT_Anexos' })
export class CatAnexo extends BaseEntity {

    @PrimaryGeneratedColumn({ name: 'IdCatAnexo' })
    id!: number;

    @Column({ 
        name: 'Descripcion', 
        type: 'varchar', 
        length: 250, 
        nullable: true 
    })
    descripcion!: string;

    @Column({ 
        name: 'RequiereEscaneo', 
        type: 'bit',
        default: false 
    })
    requiereEscaneo!: boolean;

    @Column({ 
        name: 'Activo', 
        type: 'bit', 
        default: true 
    })
    activo!: boolean;
}