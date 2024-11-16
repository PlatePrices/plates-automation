import { DataTypes, Model, Optional } from 'sequelize';
import { sequalize as sequelize } from '../../config/config.js';

interface OperationPerformanceAttributes {
  operation_id: number;
  source: string;
  startTime: Date;
  endTime: Date;
  totalDurationMs: number;
}

interface OperationPerformanceCreationAttributes
  extends Optional<OperationPerformanceAttributes, 'operation_id'> {}

class OperationPerformance
  extends Model<
    OperationPerformanceAttributes,
    OperationPerformanceCreationAttributes
  >
  implements OperationPerformanceAttributes
{
  public operation_id!: number;
  public source!: string;
  public startTime!: Date;
  public endTime!: Date;
  public totalDurationMs!: number;
}

OperationPerformance.init(
  {
    operation_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
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
    sequelize,
    tableName: 'operation_performance',
    timestamps: false,
  },
);

export default OperationPerformance;
