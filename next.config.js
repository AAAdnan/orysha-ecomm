module.exports = {
    env: {
        REACT_APP_STRIPE_PUBLISHABLE: 'pk_test_51I0yUxGXsLFTnM74unuYkIEi0LaZUroa1ip2r2WmdUCkaB0m2ghrAdb1WeATUtCXgBopKspFJ52M7WIMMuZZwq5700Iq85Jazm',
        STRIPE_SECRET: 'sk_test_51I0yUxGXsLFTnM74Mr5dEQG2ilvnNvyc3PIQec6AqsFgQuDwPE0ld5v11LVZDhH620YaSOn5rzsiQwJyzkJOnQe800iQT1uAS0'
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Note: we provide webpack above so you should not `require` it
        // Perform customizations to webpack config
        config.plugins.push(new webpack.IgnorePlugin(/mysql2/, /\/knex\//), 
                            new webpack.IgnorePlugin(/mysql/,/\/knex\//),
                            new webpack.IgnorePlugin(/sqlite3/,/\/knex\//),
                            new webpack.IgnorePlugin(/mssql/,/\/knex\//),
                            new webpack.IgnorePlugin(/oracledb/,/\/knex\//),
                            new webpack.IgnorePlugin(/pg-query-stream/,/\/knex\//),
                            )

        return config
      },
}

// {
//     plugins: [
//       new webpack.NormalModuleReplacementPlugin(/\.\.\/migrate/, '../util/noop.js'),
//       new webpack.NormalModuleReplacementPlugin(/\.\.\/seed/, '../util/noop.js'),
//       new webpack.IgnorePlugin(/mariasql/, /\/knex\//),
//       new webpack.IgnorePlugin(/mssql/, /\/knex\//),
//       new webpack.IgnorePlugin(/mysql/, /\/knex\//),
//       new webpack.IgnorePlugin(/mysql2/, /\/knex\//),
//       new webpack.IgnorePlugin(/oracle/, /\/knex\//),
//       new webpack.IgnorePlugin(/oracledb/, /\/knex\//),
//       new webpack.IgnorePlugin(/pg-query-stream/, /\/knex\//),
//       new webpack.IgnorePlugin(/sqlite3/, /\/knex\//),
//       new webpack.IgnorePlugin(/strong-oracle/, /\/knex\//),
//       new webpack.IgnorePlugin(/pg-native/, /\/pg\//)
//     ]
//   }