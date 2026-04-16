import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'OFA_CAT_Nomenclaturas' })
export class CatNomenclatura {

    @PrimaryGeneratedColumn({ name: 'IdCatNomenclatura' })
    id!: number;

    @Column({ 
        name: 'Nomenclatura', 
        type: 'varchar', 
        length: 25, 
        nullable: true 
    })
    // Corregido a string para coincidir con el VARCHAR(25) de SQL Server
    descripcion!: string;

    @Column({ 
        name: 'Activo', 
        type: 'bit', 
        default: true 
    })
    activo!: boolean;
}