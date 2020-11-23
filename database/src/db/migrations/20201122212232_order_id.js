exports.up = function(knex, Promise) {
    return knex.schema.table('basket_item_table', function(t) {
        t.integer('order_id').notNull()
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('basket_item_table', function(t) {
        t.dropColumn('order_id');
    });
};