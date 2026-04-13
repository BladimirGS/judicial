import { Router } from 'express';
import { ApelacionController } from '../controllers/ApelacionController';

const router = Router();

router.get('/capturar-apelacion', ApelacionController.getFormData);
router.get('/buscar-apelacion', ApelacionController.getByFolio);
router.post('/crear-apelacion', ApelacionController.create);
router.get('/capturar-anexo', ApelacionController.listAnexos);
router.get('/buscar', ApelacionController.search);

export default router;