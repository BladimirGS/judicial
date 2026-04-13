import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'OFA_CAT_Salas'
})
class CatSala extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'IdSala',
    })
    declare id: number;

    @Column({
        type: DataType.STRING(200),
        field: 'Descripcion'
    })
    declare descripcion: string

    @Column({
        type: DataType.BOOLEAN,
        field: 'Activo'
    })
    declare activo: boolean
}

export default CatSala