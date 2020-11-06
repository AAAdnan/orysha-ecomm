exports.up = function(knex, Promise) {
    return knex.schema.table('products', function(t){
        t.string('image')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.table('products', function(t) {
        t.dropColumn('image');
    });
};
