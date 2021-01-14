exports.up = function(knex, Promise) {
    return knex.schema.table('basket_table', function(t){
        t.string('chargeID');
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.table('basket_table', function(t) {
        t.dropColumn('chargeID');
    });
};
