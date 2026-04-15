import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Apelacion } from "./Apelacion.entity";
import { CatAnexo } from "./CatAnexo.entity";

@Entity({ name: 'OFA_ApelacionesAnexosOtros' })
export class ApelacionAnexo {

    @PrimaryGeneratedColumn({ name: 'IdTramiteAnexoOtro' })
    id!: number;

    @Column({ 
        name: 'OtroAnexo', 
        type: 'varchar', 
        length: 350, 
        nullable: true 
    })
    otroAnexo!: string;

    @Column({ 
        name: 'EsValor', 
        type: 'bit', 
        default: false 
    })
    esValor!: boolean;

    @Column({ 
        name: 'MontoAnexo', 
        type: 'varchar', 
        length: 20, 
        nullable: true 
    })
    monto!: string;

    @Column({ 
        name: 'Cantidad', 
        type: 'int', 
        nullable: true 
    })
    cantidad!: number;

    @Column({ 
        name: 'Activo', 
        type: 'bit', 
        default: true 
    })
    activo!: boolean;

    // --- Llaves Foráneas (Columnas Físicas) ---

    @Column({ name: 'IdCatAnexo', nullable: true })
    idAnexo!: number;

    @Column({ name: 'IdTramite', nullable: true })
    idApelacion!: number;

    // --- Relaciones ---

    @ManyToOne(() => Apelacion, (apelacion) => apelacion.anexos)
    @JoinColumn({ name: 'IdTramite' })
    apelacion!: Apelacion;

    @ManyToOne(() => CatAnexo)
    @JoinColumn({ name: 'IdCatAnexo' })
    anexo!: CatAnexo;
}