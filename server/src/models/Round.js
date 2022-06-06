module.exports = (sequelize, DataTypes) => {
  const Round = sequelize.define('Round', {
    round_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    round_name: {
      type: DataTypes.STRING(40),
      unique: true
    },
    start_time: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    content_id: DataTypes.INTEGER,
    division: DataTypes.STRING
  }, {
    timestamps: false
  })
  return Round
}
