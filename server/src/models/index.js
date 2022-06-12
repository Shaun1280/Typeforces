const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
)

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file !== 'index.js'
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

sequelize.models.CompetitionHistory.belongsTo(sequelize.models.User, {
  foreignKey: 'participant_id',
  targetKey: 'id'
})

sequelize.models.Round.belongsTo(sequelize.models.Content, {
  foreignKey: 'content_id',
  targetKey: 'content_id'
})

sequelize.models.Practice.belongsTo(sequelize.models.User, {
  foreignKey: 'writer_id',
  targetKey: 'id'
})

module.exports = db
