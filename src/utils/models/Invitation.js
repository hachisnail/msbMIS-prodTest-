import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

const Invitation = sequelize.define('Invitation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  contact_number: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'staff'),
    allowNull: false,
    defaultValue: 'staff'
  },
  position: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'invitations',
  timestamps: true
});

export default Invitation;
