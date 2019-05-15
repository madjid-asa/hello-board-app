'use strict';
module.exports = (sequelize, DataTypes) => {
  const LogBoard = sequelize.define('LogBoard', {
    data: DataTypes.STRING
  }, {});
  LogBoard.associate = function(models) {
    // associations can be defined here
  };
  return LogBoard;
};