const path = require('path')
require('dotenv').config()

module.exports = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: process.env.PGUSER || 'adnan',
    port: process.env.PGPORT || '5433',
    password: process.env.PGPASSWORD || 'yasmeen60',
    database: process.env.PGDATABASE || 'productdb',
  },
  migrations: {
    directory: path.join(__dirname, 'src', 'db', 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'src', 'db', 'seeds')
  }
}


