import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

const LoginLog = sequelize.define('LoginLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  credential_id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'credentials',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  last_login: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  start: {
    type: 'TIMESTAMP', 
    allowNull: false,
  },
  end: {
    type: 'TIMESTAMP', 
    allowNull: true,   
  },
}, {
  tableName: 'login_logs',
  timestamps: false,
});


export default LoginLog;
