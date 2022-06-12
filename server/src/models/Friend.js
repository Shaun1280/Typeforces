module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('Friend', {
    id1: {
      type: DataTypes.STRING(255),
      primaryKey: true
    },
    id2: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      validate: {
        greaterThanId1 (value) {
          if (value <= this.id1) {
            throw new Error('id1 should be less than id2')
          }
        }
      }
    },
    req_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        inId12 (value) {
          if (value !== this.id1 && value !== this.id2) {
            throw new Error('req_id shoule be in {id1, id2}')
          }
        }
      }
    },
    created_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: false
  })
  return Friend
}
