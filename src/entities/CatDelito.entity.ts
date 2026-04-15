import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'OFA_CAT_Delitos' })
export class CatDelito {

    @PrimaryGeneratedColumn({ name: 'IdCatDelito' })
    id!: number;

    @Column({ 
        name: 'Delito', 
        type: 'varchar', 
        length: 255, 
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