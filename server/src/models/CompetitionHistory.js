module.exports = (sequelize, DataTypes) => {
  const CompetitionHistory = sequelize.define('CompetitionHistory', {
    round_no: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    participant_id: {
      type: DataTypes.STRING(255),
      primaryKey: true
    },
    prev_rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    post_rating: {
      type: DataTypes.INTEGER
    },
    rank: {
      type: DataTypes.INTEGER
    },
    miss_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type_progress: { // 0 unfinished, 1 finished
      type: DataTypes.FLOAT(6, 5),
      allowNull: false
    },
    wpm: {
      type: DataTypes.FLOAT(4, 1),
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false
  })
  return CompetitionHistory
}
