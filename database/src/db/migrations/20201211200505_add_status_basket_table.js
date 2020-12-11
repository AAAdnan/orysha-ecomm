exports.up = function(knex, Promise) {
    return knex.schema.table('basket_table', function(t){
        t.string('status');
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.table('basket_table', function(t) {
        t.dropColumn('status');
    });
};
