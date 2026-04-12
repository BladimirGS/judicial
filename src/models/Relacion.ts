import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import Apelacion from "./Apelacion";
import ApelacionParte from "./ApelacionParte";
import DelitoRelacion from './DelitoRelacion';

@Table({
    tableName: 'OFA_Relaciones'
})
class Relacion extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'IdRelacion',
    })
    declare id: number;

    @Column({
        type: DataType.BOOLEAN,
        field: 'Activo'
    })
    declare activo: boolean

    // Foreign keys

    @ForeignKey(()=> ApelacionParte)
    @Column({
        type: DataType.INTEGER,
        field: 'IdApelacionParteOfendido'
    })
    declare idApelacionParteOfendido: number;

    @ForeignKey(()=> ApelacionParte)
    @Column({
        type: DataType.INTEGER,
        field: 'IdApelacionParteProcesado'
    })
    declare idApelacionParteProcesado: number;

    @ForeignKey(()=> Apelacion)
    @Column({
        type: DataType.INTEGER,
        field: 'IdApelacion'
    })
    declare idApelacion: number;

    // Relaciones

    @BelongsTo(() => ApelacionParte)
    declare apelacionParteOfendido: ApelacionParte[];

    @BelongsTo(() => ApelacionParte)
    declare apelacionParteProcesado: ApelacionParte[];

    @BelongsTo(() => Apelacion)
    declare apelacion: Apelacion;

    @HasMany(() => DelitoRelacion)
    declare delitoRelaciones: DelitoRelacion[];
}

export default Relacion