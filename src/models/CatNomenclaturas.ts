import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'OFA_CAT_Nomenclaturas'
})

class CatNomenclatura extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatNomenclatura'
    })
    declare id: number

    @Column({
        type: DataType.STRING(25),
        field: 'Nomenclatura'
    })
    declare nomenclatura: number

    @Column({
        type: DataType.BOOLEAN,
        field: 'Activo'
    })
    declare activo: boolean
}

export default CatNomenclatura