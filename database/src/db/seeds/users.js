async function clear(knex) {
    await knex('user_table').del()
  }
  
  async function seed(knex) {
    await clear(knex)
    await knex('user_table').insert({
      name: 'adnan',
      email: 'adnan_ahmed01@gmail.com',
      password: 'abc123'
    })
  }
  
  module.exports = { clear, seed }