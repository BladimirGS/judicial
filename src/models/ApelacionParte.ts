import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Apelacion from "./Apelacion";
import TipoParte from "./TipoParte";
import Sexo from "./CatSexo";

@Table({
    tableName: 'OFA_ApelacionPartes'
})
class ApelacionParte extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'IdApelacionParte',
    })
    declare id: number;

    @Column({
        type: DataType.STRING(300),
        field: 'Nombre'
    })
    declare nombre: string

    @Column({
        type: DataType.STRING(25),
        field: 'Direccion'
    })
    declare direccion: string

    @Column({
        type: DataType.BOOLEAN,
        field: 'MenorEdad'
    })
    declare menorEdad: string

    @Column({
        type: DataType.BOOLEAN,
        field: 'Activo'
    })
    declare activo: boolean

    // Foreign Keys

    @ForeignKey(()=> Apelacion)
    @Column({
        type: DataType.INTEGER,
        field: 'IdApelacion'
    })
    declare idApelacion: number;

    @ForeignKey(()=> TipoParte)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatTipoParte'
    })
    declare idTipoParte: number;

    @ForeignKey(()=> Sexo)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatSexo'
    })
    declare idSexo: number;

    // Relaciones

    // @BelongsTo(() => Apelacion)
    // declare apelacion: Apelacion;

    @BelongsTo(() => TipoParte)
    declare tipoParte: TipoParte;

    @BelongsTo(() => Sexo)
    declare sexo: Sexo;
}

export default ApelacionParte