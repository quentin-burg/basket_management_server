module.exports = (sequelize, DataTypes) => {
  const Bill = sequelize.define('Bill', {
    id : {
      allowNull    : false,
      primaryKey   : true,
      type         : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
    },
    date : {
      type : DataTypes.STRING,
    },
    userId : {
      type : DataTypes.UUID,
    },
  });
  return Bill;
};
