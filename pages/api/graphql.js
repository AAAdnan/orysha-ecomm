require('dotenv').config()
import { ApolloServer, gql, AuthenticationError } from "apollo-server-micro";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import database from '../../database/knex';
const typeDefs = require('../../pages/api/schema');
import  { toCursorHash, fromCursorHash } from './cursorHash'


//limit, offset pagination
//product as a total count
//infinite scroll
//apollo graphql pagination  - fetchmore variable
//

 
const resolvers = {
  Query: {
    //   // take limit, offset for next page and encrypt - return as token
    //   // replace limit and offset with pageSize
    //   // select from products where id > cursor with limit + 1 
    //   // only return the number of products as per the limit, limit + 1  => item.id == cursor
    //   // order by ID
    products: async(parent, { pageSize = 2, cursor }) => {

      let decodedCursor

      if (cursor) {
       decodedCursor = fromCursorHash(cursor);
      }

      const products = decodedCursor ? await database.select().from('products').where('id', '>', decodedCursor).limit(pageSize + 1) :
                       await database.select().from('products').limit(pageSize + 1)

      const hasNextPage = products.length > pageSize;
      
      const nodes = hasNextPage ? products.slice(0, -1) : products;

      const edges = nodes.map((node) => {
        return { node: node}
      })

      return {
        edges: edges,
        pageInfo: {
          hasNextPage: hasNextPage,
          endCursor: toCursorHash(nodes[nodes.length - 1].id.toString())
        }
      }
    },
    users: async () => {
      const users = await database.select().from('user_table')
      return users
    }
  },

  Mutation: {

    async updateProduct (root, { id, name, description, price, size}, context, info) {

      if (!context.user) return 'not allowed to update a product';

      
      const [ updatedProduct ] = await database('products').where( { id } ).update({
        name, description, price, size
      }, ['id', 'name', 'description', 'price', 'size'])

      return updatedProduct;
    },

    async addProduct(root, { name, description, price, size}, context, info) {

      if (!context.user) return 'not allowed to create product';

      if(context.user) {

        const customer_id = context.user;

        const [ addProduct ] = await database('products').insert({ name, description, price, size, customer_id}, [
          'name', 'description', 'price', 'size', 'customer_id' , 'id' ])
                  
        return addProduct;

      }

     
    },

    async deleteProduct(root, { id }, context, info){

      if (!context.user) return 'not allowed to delete products';

      await database('products').where( { id } ).del()

      console.log('Success')

    },

    async createBasket(root, args, context){

      if (!context.user) return 'not allowed to create baskets';

        const [ createBasket ] = await database('basket_table').insert( { user_id : context.user && context.user.id} , [
          'id'
        ])

      return createBasket;
    },

    async signup( root, { name, email, password }, info) {

      // add role field to database
      // add to the jwt, check from context
      // check if user.role === admin/{}

      const passwordHashed = await bcrypt.hash(password,10);

      const [ user ] = await database('user_table').insert({ name, email, password: passwordHashed}, [
        'name', 'email', 'password', 'id'])

      const token = jwt.sign( { userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d'})

      return {
        token,
        user
      }
    },

    async login(_, { email, password, }) {

    
      // 1
      const [ user ] = await database('user_table').where( { email })

      if (!user) {
        throw new Error('No such user found')
      }
    
      // 2
      
      const valid = await bcrypt.compare(password, user.password)

      if (!valid) {
        throw new Error('Invalid password')
      }
    
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d'} )
    
      // 3
      return {
        token,
        tokenExpiration: 1,
        user,
      }
    }
  },
}

const getUserId = (token) => {

  try{
    const tokenNew = token.replace('Bearer ', '')
    const { userId } = jwt.verify(tokenNew, process.env.ACCESS_TOKEN_SECRET)
  
    return userId
  }
  catch(e){
    console.log(e.stack)

    return null;
  }
 
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {

  
    const token = req.headers.authorization || '';

    if(token){
      const user = getUserId(token);

      return { user };

    }
    else return {}

  }
});


const handler = server.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;