exports.up = function(knex) {
    return knex.schema.table('products', function(t) {
        t.dropColumn('password');
    });
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('products', function(table){
            table.dropColumn('password')
        })
    ])
}
