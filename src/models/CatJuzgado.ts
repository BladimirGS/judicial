import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";


@Table({
    tableName: 'OFA_CAT_Juzgados'
})

class CatJuzgados extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatJuzgado'
    })
    declare id: number

    @Column({
        type: DataType.STRING(25),
        field: 'Descripcion'
    })
    declare descripcion: string

    @Column({
        type: DataType.BOOLEAN,
        field: 'Activo'
    })
    declare activo: boolean
}

export default CatJuzgados