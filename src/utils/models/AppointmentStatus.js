// models/AppointmentStatus.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js'; 
import Appointment from './Appointment.js';


const AppointmentStatus = sequelize.define('AppointmentStatus', {
  status_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Appointment,
      key: 'appointment_id'
    },
    onDelete: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM('TO_REVIEW', 'CONFIRMED', 'REJECTED', 'FAILED', 'COMPLETED'),
    allowNull: false,
    defaultValue: 'TO_REVIEW'
  },
  present_count: {
    type: DataTypes.INTEGER,
    allowNull: true, // no default, NULL means "ongoing" in the front-end
    comment: 'Number of visitors who actually showed up'
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'appointment_status',
  timestamps: false
});

Appointment.hasOne(AppointmentStatus, { foreignKey: 'appointment_id' });
AppointmentStatus.belongsTo(Appointment, { foreignKey: 'appointment_id' });

export default AppointmentStatus;
