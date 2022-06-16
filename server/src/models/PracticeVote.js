module.exports = (sequelize, DataTypes) => {
  const PracticeVote = sequelize.define('PracticeVote', {
    practice_no: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    voter_id: {
      type: DataTypes.STRING(255),
      primaryKey: true
    },
    vote_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: false
  })
  return PracticeVote
}