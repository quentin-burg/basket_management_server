export default (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id : {
      allowNull    : false,
      primaryKey   : true,
      type         : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
    },
    articleId : {
      type : DataTypes.INTEGER,
    },
    name : {
      type : DataTypes.TEXT,
    },
    quantity : {
      type : DataTypes.INTEGER,
    },
    price : {
      type : DataTypes.REAL,
    },
    userId : {
      type : DataTypes.UUID,
    },
  });
  return Order;
};
