import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'OFA_CAT_Municipios' })
export class CatMunicipio {

    @PrimaryGeneratedColumn({ name: 'IdCatMunicipio' })
    id!: number;

    @Column({ 
        name: 'Descripcion', 
        type: 'varchar', 
        length: 300, 
        nullable: true 
    })
    descripcion!: string;

    @Column({ 
        name: 'Activo', 
        type: 'bit', // Mapeo correcto para SQL Server
        default: true 
    })
    activo!: boolean;
}