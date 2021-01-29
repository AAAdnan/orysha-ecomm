const path = require('path')
require('dotenv').config()

console.log(process.env.PGHOST)

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.PGHOST,
    user: process.env.PGUSER || 'adnan',
    port: process.env.PGPORT || '5432',
    password: process.env.PGPASSWORD || 'yasmeen60',
    database: process.env.PGDATABASE || 'orysha',
  },
  migrations: {
    directory: path.join(__dirname, 'src', 'db', 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'src', 'db', 'seeds')
  }
}


