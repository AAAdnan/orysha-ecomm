import knex from 'knex';
import config from './knexfile';

const Knex = knex(
    config
  );
  
export default Knex;