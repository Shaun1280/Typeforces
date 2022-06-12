module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    receiver_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sender_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        greaterThanId1 (value) {
          if (value.length > 40) {
            throw new Error('message length can\'t be greater than 40')
          }
        }
      }
    },
    send_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    view_tag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: false
  })
  return Message
}
