import express from 'express';
import morgan from 'morgan';
import apelacionRoutes from './routes/apelacionRoutes';
import cors from 'cors'

const app = express();

// Middlewares 
app.use(cors());
app.use(morgan('dev')); 
app.use(express.json()); 

// Rutas
app.use('/api/apelaciones', apelacionRoutes);

export default app;