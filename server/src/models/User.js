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
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword,
      // beforeSave: hashPassword
    }
  })

  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compareAsync(password, this.password)
  }

  return User
}
