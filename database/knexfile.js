const path = require('path')
require('dotenv').config()

console.log(process.env.DATABASE_URL)


module.exports = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  },
    // host: process.env.PGHOST,
    // user: process.env.PGUSER || 'postgres',
    // port: process.env.PGPORT || '5433',
    // password: process.env.PGPASSWORD || 'yasmeen60',
    // database: process.env.PGDATABASE || 'productdb',
  migrations: {
    directory: path.join(__dirname, 'src', 'db', 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'src', 'db', 'seeds')
  }
}


