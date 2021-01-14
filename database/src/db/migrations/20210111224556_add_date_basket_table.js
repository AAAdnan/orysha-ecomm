exports.up = function(knex, Promise) {
    return knex.schema.table('basket_table', function(t){
        t.integer('date');
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.table('basket_table', function(t) {
        t.dropColumn('date');
    });
};
