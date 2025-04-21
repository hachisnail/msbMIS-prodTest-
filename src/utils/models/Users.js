import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import Credential from './Credential.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  credential_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Credential,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'inactive',
  },

  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  modified_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

User.belongsTo(Credential, { foreignKey: 'credential_id' });

export default User;
