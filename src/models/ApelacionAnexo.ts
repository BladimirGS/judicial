import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import Apelacion from "./Apelacion";
import ApelacionParte from "./ApelacionParte";
import DelitoRelacion from './DelitoRelacion';
import Anexo from "./CatAnexo";
import CatAnexo from "./CatAnexo";

@Table({
    tableName: 'OFA_ApelacionesAnexosOtros'
})
class Relacion extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'IdTramiteAnexoOtro',
    })
    declare id: number;

    @Column({
        type: DataType.STRING(350),
        field: 'OtroAnexo'
    })
    declare otroAnexo: string

    @Column({
        type: DataType.BOOLEAN,
        field: 'EsValor'
    })
    declare esValor: boolean

    @Column({
        type: DataType.STRING(20),
        field: 'MontoAnexo'
    })
    declare monto: string

    @Column({
        type: DataType.INTEGER,
        field: 'Cantidad'
    })
    declare cantidad: number;

    @Column({
        type: DataType.BOOLEAN,
        field: 'Activo'
    })
    declare activo: boolean

    // Foreign keys

    @ForeignKey(()=> CatAnexo)
    @Column({
        type: DataType.INTEGER,
        field: 'IdCatAnexo'
    })
    declare idAnexo: number;

    @ForeignKey(()=> Apelacion)
    @Column({
        type: DataType.INTEGER,
        field: 'IdTramite'
    })
    declare idApelacion: number;

    // Relaciones
    
    @BelongsTo(() => Apelacion, { foreignKey: 'idApelacion' })
    declare apelacion: Apelacion;

    @BelongsTo(() => Anexo)
    declare anexo: Anexo;
}

export default Relacion