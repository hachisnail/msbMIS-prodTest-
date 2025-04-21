import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('msb_db', 'root', 'P3iWYT7kuWY0SBxgZOwBGAIhH7br7P9WGEEThewJ0Vr8WRDbml0Kpg1kZY2liGgp', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); 
  }
};
