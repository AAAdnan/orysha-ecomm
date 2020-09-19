exports.up = function(knex, Promise) {
    return knex.schema.alterTable('products', function(t) {
        t.integer('customer_id').references('id').inTable('user_table').alter();
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.table('products', function(t) {
        t.dropColumn('customer_id');
    });
};