import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'OFA_CAT_Apelaciones'
})
class CatApelacion extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatApelacion'
    })
    declare id: Number;
    
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

export default CatApelacion