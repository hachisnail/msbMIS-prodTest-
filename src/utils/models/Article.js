import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import User from './Users.js';

const Article = sequelize.define('Article', {
  article_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Credential,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  upload_date: {
    type: DataTypes.DATE, // store as string for manual input like "April 18, 2025"
    allowNull: true,
  },
  images: {
    type: DataTypes.TEXT, // store base64, file path, or JSON string of image URLs
    allowNull: true,
  },
  article_category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  upload_period: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'articles',
  timestamps: false,
});

Article.belongsTo(User, { foreignKey: 'user_id' });

export default Article;
