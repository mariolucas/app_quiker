const path = require('path'); 
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST || 'db',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD  || 'root' ,
    database: process.env.MYSQL_DATABASE || 'teste_quiker_db',
    port: process.env.MYSQL_PORT,
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
  }
}