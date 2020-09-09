async function clear(knex) {
  await knex('products').del()
}

async function seed(knex) {
  await clear(knex)
  await knex('products').insert({
    name: 'trousers',
    description: 'pair of trousers',
    price: 3,
    size: 4
  })
}

module.exports = { clear, seed }