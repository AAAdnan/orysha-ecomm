exports.up = function(knex, Promise) {
    return knex.schema.table('products', function(t) {
        t.integer('customer_id').notNull().defaultTo(0);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('products', function(t) {
        t.dropColumn('customer_id');
    });
};