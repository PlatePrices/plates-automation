import { DataTypes } from 'sequelize';
import { sequalize } from '../../config/config.js';

const MainOperationPerformance = sequalize.define(
  'MainOperationPerformance',
  {
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalDurationMs: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'main_operation_performance',
    timestamps: false,
  },
);

export default MainOperationPerformance;
