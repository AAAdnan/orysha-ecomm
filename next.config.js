module.exports = {
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

// env: {
//     REACT_APP_STRIPE_PUBLISHABLE: 'pk_test_51I0yUxGXsLFTnM74unuYkIEi0LaZUroa1ip2r2WmdUCkaB0m2ghrAdb1WeATUtCXgBopKspFJ52M7WIMMuZZwq5700Iq85Jazm',
//     STRIPE_SECRET: 'sk_test_51I0yUxGXsLFTnM74Mr5dEQG2ilvnNvyc3PIQec6AqsFgQuDwPE0ld5v11LVZDhH620YaSOn5rzsiQwJyzkJOnQe800iQT1uAS0',
//     DATABASE_URL: 'DATABASE_URL=postgres://gpqlbrpjrvvtyf:3e7839cdc3a7c6807bee93c7b45c153b9d7bcc4a749e88ad54ad081f75bf4137@ec2-54-220-195-236.eu-west-1.compute.amazonaws.com:5432/df2tsiahensut'
// },
