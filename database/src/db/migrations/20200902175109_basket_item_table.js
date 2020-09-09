exports.up = function(knex) {
    return knex.schema.createTable('basket_item_table', t => {
        t.increments('id').unsigned().primary();
        t.integer('basket_quantity').notNull();
    })
  }

exports.down = function(knex) {
  return knex.schema.dropTable('basket_table')
}
