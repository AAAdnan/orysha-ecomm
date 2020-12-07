exports.up = function(knex) {
    return knex.schema.createTable('basket_item_table', t => {
        t.increments('id').unsigned().primary();
        t.integer('product_id').references('id').inTable('products');
        t.integer('basket_table_id').references('id').inTable('basket_table');
        t.integer('basket_quantity').notNull();
    })
  }

exports.down = function(knex) {
  return knex.schema.dropTable('basket_item_table')
}
