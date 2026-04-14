import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: 'OFA_CAT_Anexos' })
export class CatAnexo extends BaseEntity {

    @PrimaryGeneratedColumn({ name: 'IdCatAnexo' })
    id!: number;

    @Column({ 
        name: 'Descripcion', 
        type: 'varchar', 
        length: 250, 
        nullable: true // Sequelize por defecto permite null si no especificas
    })
    descripcion!: string;

    @Column({ 
        name: 'RequiereEscaneo', 
        type: 'bit', // En SQL Server el booleano es tipo bit
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