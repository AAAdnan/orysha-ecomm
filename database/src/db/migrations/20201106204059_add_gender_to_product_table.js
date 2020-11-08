exports.up = function(knex, Promise) {
    return knex.schema.table('products', function(t){
        t.string('gender')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.table('products', function(t) {
        t.dropColumn('gender');
    });
};
