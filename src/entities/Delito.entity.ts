import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'OFA_CAT_Delitos' })
export class Delito {

    @PrimaryGeneratedColumn({ name: 'IdCatDelito' })
    id!: number;

    @Column({ 
        name: 'Delito', // El nombre físico en SQL Server
        type: 'varchar', 
        length: 255, 
        nullable: true 
    })
    // Mantenemos el nombre de la propiedad como 'delito' para tu lógica dinámica
    descripcion!: string;

    @Column({ 
        name: 'Activo', 
        type: 'bit', 
        default: true 
    })
    activo!: boolean;
}