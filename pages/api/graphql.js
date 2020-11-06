require('dotenv').config()
import { ApolloServer, gql, AuthenticationError } from "apollo-server-micro";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import database from '../../database/knex';
const typeDefs = require('../../pages/api/schema');
import cookieCutter from 'cookie-cutter'
import  { toCursorHash, fromCursorHash } from './cursorHash'
 
const resolvers = {
  Query: {
    products: async(parent, { pageSize = 2, cursor, name }) => {

      let decodedCursor

      if (cursor) {
       decodedCursor = fromCursorHash(cursor);
      }

      const baseQuery = database.select().from('products');

      if (decodedCursor) {
        baseQuery.where('id', '>', decodedCursor)
      }

      if (name) {
        baseQuery.where('name', 'like', `%${name}%`)
      }
      
      const products = await baseQuery.limit(pageSize + 1)

      const nodes = products.slice( 0 , pageSize );

      const edges = nodes.map((node) => {
        return { node }
      })

      const nextProduct = products[pageSize]

      const endCursor = nextProduct ? toCursorHash(nextProduct.id.toString()) : null


      return {
        edges,
        pageInfo: {
          endCursor
        }
      }
    },
    users: async () => {
      const users = await database.select().from('user_table')
      return users
    },
    me: async( root, { user }, context,info) => {

      if(!user) {
        throw new Error('You are not authenticated')
      }

      const id = user.id

      return await database('user_table').where( id )

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

    async addProduct(root, { name, description, price, size, image}, context, info) {

      console.log(image)

      console.log(name)

      if (!context.user) return 'not allowed to create product';

      if(context.user) {

        const customer_id = context.user;

        const [ addProduct ] = await database('products').insert({ name, description, price, size, customer_id, image}, [
          'name', 'description', 'price', 'size', 'customer_id' , 'image', 'id' ])
                  
        return addProduct;

      }

     
    },

    async deleteProduct(root, { id }, context, info){

      if (!context.user || context.user.role === 'buyer') return 'not allowed to delete products';

      if(context.user.role === 'admin') {
       return await database('products').where( { id } ).del()
      }

      if(context.user.role === 'seller') {
       return await database('products').where( { id, merchant_id: context.user.userId } ).del()
        
      }

      console.log('Success')

    },

    async createBasket(root, args , context){

      if (!context.user) return 'not allowed to create baskets';

        const [ createBasket ] = await database('basket_table').insert( { user_id : context.user && context.user.id} , [
          'id'
        ])

      return createBasket;
    },

    async signUpUser( root, { name, email, password }, info) {

      const [ foundUser ] = await database('user_table').where( { email })

      if(foundUser) throw new Error('Email already registered')

      const passwordHashed = await bcrypt.hash(password,10);

      const [ user ] = await database('user_table').insert({ name, email, password: passwordHashed}, [
        'name', 'email', 'password', 'id', 'role'])

      const token = jwt.sign( { userId: user.id, email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d'})

      return { userId: user.id, token }
    },

    async loginUser(_, { email, password, }) {

    
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
    
      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d'} )
    


      // 3
      return {
        token,
        tokenExpiration: 1,
      }
    }
  },
}

const getUser = (token) => {

  try{
    const tokenNew = token.replace('Bearer ', '')

    const { userId, role } = jwt.verify(tokenNew, process.env.ACCESS_TOKEN_SECRET)
  
    return { userId, role }
  }
  catch(e){
    console.log(e.stack)

    return null;
  }
 
}

const context = ({ req }) => {

  const token = req.headers.authorization || '';

  if(token) {
    const user = getUser(token);

    return { user }
  }
  else return {}

}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});


const handler = server.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;