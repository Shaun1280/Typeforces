module.exports = (sequelize, DataTypes) => {
  const Contest = sequelize.define('Round', {
    round_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    round_name: DataTypes.STRING(40),
    start_time: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    content_id: DataTypes.INTEGER,
    division: DataTypes.INTEGER
  })
  return Contest
}
