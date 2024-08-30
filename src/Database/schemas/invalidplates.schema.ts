import { DataTypes } from 'sequelize';
import { sequalize } from '../../config/config.js';

const InvalidPlate = sequalize.define(
  'InvalidPlate',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    character: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    emirate: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    last_duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: 'invalid_plates',
    timestamps: true,
  },
);

export default InvalidPlate;
