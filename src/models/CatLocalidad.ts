import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'OFA_CAT_Localidades'
})

class CatLocalidad extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatColLocalidad'
    })
    declare id: number

    @Column({
        type: DataType.STRING(300),
        field: 'Descripcion'
    })
    declare descripcion: string

    @Column({
        type: DataType.BOOLEAN,
        field: 'Activo'
    })
    declare activo: boolean
}

export default CatLocalidad