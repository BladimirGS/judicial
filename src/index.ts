import 'reflect-metadata'; 
import dotenv from 'dotenv';
import colors from 'colors';
import server from './server';
import { connectDB } from './config/typeorm.config';

dotenv.config();

const port = process.env.PORT || 4000;

const startApp = async () => {
    await connectDB();

    server.listen(port, () => {
        console.log(colors.magenta.bold(`Servidor listo en: http://localhost:${port}`));
    });
};

startApp();