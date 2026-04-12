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
    
    @BelongsTo(() => Apelacion)
    declare apelacion: Apelacion;

    @BelongsTo(() => ApelacionParte, { foreignKey: 'idApelacionParteOfendido', as: 'ofendido' })
    declare ofendido: ApelacionParte;

    @BelongsTo(() => ApelacionParte, { foreignKey: 'idApelacionParteProcesado', as: 'procesado' })
    declare procesado: ApelacionParte;

    @HasMany(() => DelitoRelacion, 'idRelacion')
    declare delitoRelaciones: DelitoRelacion[];
}

export default Relacion