import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Relacion from "./Relacion";
import Delito from "./Delito";

@Table({
    tableName: 'OFA_DelitosRelaciones'
})
class DelitoRelacion extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'IdDelitoRelacion',
    })
    declare id: number;

    @Column({
        type: DataType.BOOLEAN,
        field: 'Activo'
    })
    declare activo: boolean

    // Foreign Key

    @ForeignKey(()=> Relacion)
    @Column({
        type: DataType.INTEGER,
        field: 'IdRelacion'
    })
    declare idRelacion: number;

    @ForeignKey(()=> Delito)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatDelito'
    })
    declare idDelito: number;

    @BelongsTo(() => Relacion)
    declare relacion: Relacion;

    @BelongsTo(() => Delito)
    declare delito: Delito;
}

export default DelitoRelacion