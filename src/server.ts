import express from 'express';
import morgan from 'morgan';
import apelacionRoutes from './routes/apelacionRoutes';

const app = express();

// Middlewares 
app.use(morgan('dev')); 
app.use(express.json()); 

// Rutas
app.use('/api/apelaciones', apelacionRoutes);

export default app;