import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import colors from 'colors';
import path from 'path';

dotenv.config();

// Creamos la instancia de Sequelize
export const sequelize = new Sequelize({
  dialect: 'mssql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false, 
  models: [path.join(__dirname, '../models/**/*.{js,ts}')],
  define: {
    timestamps: false, 
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(colors.cyan.bold('Conexión exitosa a la base de datos'));
  } catch (error) {
    console.log(colors.red.bold('Error al conectar a la base de datos'));
    console.error(error);
  }
};