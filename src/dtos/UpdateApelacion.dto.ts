import { CreateApelacionDTO } from './CreateApelacion.dto';

// Permite enviar solo los campos que cambiaron
export interface UpdateApelacionDTO extends Partial<CreateApelacionDTO> {
    id: number; // El ID es obligatorio para saber qué editar
}