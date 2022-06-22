module.exports = (sequelize, DataTypes) => {
  const Practice = sequelize.define('Practice', {
    practice_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    practice_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    content_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    publish_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    writer_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    timestamps: false
  })
  return Practice
}
