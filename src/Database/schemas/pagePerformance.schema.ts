import { DataTypes } from 'sequelize';
import { sequalize } from '../../config/config.js';

const PagePerformance = sequalize.define(
  'PagePerformance',
  {
    page_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    operation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    page_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    durationMs: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'page_performance',
    timestamps: false,
  },
);

export default PagePerformance;
