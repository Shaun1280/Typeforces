module.exports = {
  port: process.env.PORT || 3306,
  db: {
    database: process.env.DB_NAME || 'nodetest',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '118294191',
    options: {
      dialect: process.env.DIALECT || 'mysql',
      host: process.env.HOST || 'localhost',
    }
  }
}
