exports.up = function(knex) {
    return knex.schema.createTable('user_table', t => {
        t.increments('id').unsigned().primary();
        t.string('name').notNull();
        t.string('email').notNull();
        t.string('password').notNull();
    })
  }

exports.down = function(knex) {
  return knex.schema.dropTable('user_table')
}