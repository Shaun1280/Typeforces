const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

async function hashPassword (user, options) {
  const SALT_FACTOR = 8

  if (!user.changed('password')) {
    return
  }

  const salt = await bcrypt
    .genSaltAsync(SALT_FACTOR)
  const hash = await bcrypt.hashAsync(user.password, salt, null)
  user.setDataValue('password', hash)
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true
    },
    password: DataTypes.STRING(255),
    user_name: {
      type: DataTypes.STRING(255),
      unique: true
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 1500
    },
    status: {
      type: DataTypes.STRING(8),
      validate: {
        isIn: [['admin', 'student', 'bot', 'other']]
      }
    },
    country: DataTypes.STRING(32),
    register_time: DataTypes.DATE,
    last_visit: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
      // beforeSave: hashPassword
    },
    timestamps: false
  })

  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compareAsync(password, this.password)
  }

  return User
}
