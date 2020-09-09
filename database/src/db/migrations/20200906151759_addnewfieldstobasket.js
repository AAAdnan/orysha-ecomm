exports.up = function(knex, Promise) {
    return knex.schema.table('basket_item_table', function(t){
        t.integer('product_id').references('id').inTable('products');
        t.integer('basket_table_id').references('id').inTable('basket_table');
        t.specificType('intarray', 'integer Array')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.table('basket_item_table', function(t) {
        t.dropColumn('');
    });
};
