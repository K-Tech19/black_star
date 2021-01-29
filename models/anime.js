'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class anime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.anime.hasMany(models.comments)
      models.anime.belongsToMany(models.user, {through: "user_anime"})
    }
  };
  anime.init({
    name: DataTypes.STRING,
    date: DataTypes.STRING,
    imageurl: DataTypes.STRING,
    mal_id: DataTypes.STRING,
    rated: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'anime',
  });
  return anime;
};