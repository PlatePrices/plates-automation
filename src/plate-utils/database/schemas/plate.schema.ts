// import { DataTypes } from 'sequelize';

// import { sequalize } from '../../../config.js';

// const plateAttributes = {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   number: {
//     type: DataTypes.STRING(50),
//     allowNull: false,
//   },
//   url: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   source: {
//     type: DataTypes.STRING(50),
//     allowNull: false,
//   },
//   price: {
//     type: DataTypes.STRING(50),
//   },
//   character: {
//     type: DataTypes.STRING(10),
//     allowNull: false,
//   },
//   image: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   emirate: {
//     type: DataTypes.STRING(50),
//     allowNull: true,
//   },
//   last_duration: {
//     type: DataTypes.STRING(50),
//     allowNull: true,
//   },
//   contact: {
//     type: DataTypes.STRING(50),
//     allowNull: true,
//   },
// };
// const ValidPlates = sequalize.define('Plate', plateAttributes, {
//   tableName: 'plates',
//   timestamps: false,
// });
// const InvalidPlate = sequalize.define('InvalidPlates', plateAttributes, {
//   tableName: 'invalid_plates',
//   timestamps: false,
// });
// export { ValidPlates, InvalidPlate };
