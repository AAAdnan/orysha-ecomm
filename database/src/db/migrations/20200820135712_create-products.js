exports.up = function(knex) {
    return knex.schema.createTable('products', t => {
        t.increments('id').unsigned().primary();
        t.string('name').notNull();
        t.string('description').notNull();
        t.integer('price').notNull();
        t.integer('size').notNull();
        t.uuid('merchant_id');
    })
  }

exports.down = function(knex) {
  return knex.schema.dropTable('products')
}