exports.up = function(knex) {
    return knex.schema.createTable('basket_table', t => {
        t.increments('id').unsigned().primary();
        t.integer('user_id').references('id').inTable('user_table');
    })
  }

exports.down = function(knex) {
  return knex.schema.dropTable('basket_table')
}