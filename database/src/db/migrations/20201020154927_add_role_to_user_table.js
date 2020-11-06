exports.up = function(knex, Promise) {
    return knex.schema.table('user_table', function(t){
        t.string('role').defaultTo('buyer')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.table('user_table', function(t) {
        t.dropColumn('role');
    });
};
