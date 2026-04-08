import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
    tableName: 'OFA_CAT_Materias'
})
class CatMateria extends Model {
    
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatMateria'
    })
    declare id: number;

    @Column({
        type: DataType.STRING(25),
        allowNull: false,
        field: 'Descripcion'
    })
    declare descripcion: string;

    @Column({
        type: DataType.BOOLEAN,
        field: 'Activo'
    })
    declare activo: boolean
}

export default CatMateria;