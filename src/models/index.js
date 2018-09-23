// FIXME babelify API server

import Sequelize from 'sequelize';
import config from 'config';
import path from 'path';
import fs from 'fs';

const dbConfig = { ...config, dialect : 'postgres' };

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  dbConfig
);

const db = {};
const basename = path.basename(module.filename);

fs.readdirSync(__dirname)
  .filter(function(file) {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(function(file) {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
