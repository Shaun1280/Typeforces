module.exports = (sequelize, DataTypes) => {
  const PracticeHistory = sequelize.define('PracticeHistory', {
    practice_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    practice_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    practicer_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    miss_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wpm: {
      type: DataTypes.FLOAT(4, 1),
      allowNull: false
    }
  }, {
    timestamps: false
  })
  return PracticeHistory
}
