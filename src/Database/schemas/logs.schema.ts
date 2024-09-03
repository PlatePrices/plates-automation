import { DataTypes } from 'sequelize';
import { sequalize } from '../../config/config.js';

const logs = sequalize.define(
  'log',
  {
    log_id: {
      type: DataTypes.STRING(50),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    level: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'logs',
    timestamps: false,
  },
);

export default logs;
