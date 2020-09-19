require('dotenv').config()
import { ApolloServer, gql, AuthenticationError } from "apollo-server-micro";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import database from '../../database/knex';
const typeDefs = require('../../pages/api/schema');


const resolvers = {
  Query: {
    allProducts: async () => {
      const products = await database.select().from('products')
      return products
    },
    users: async () => {
      const users = await database.select().from('user_table')
      return users
    }
  },

  Mutation: {

    async updateProduct (root, { id, name, description, price, size}, context, info) {
      
      const [ updatedProduct ] = await database('products').where( { id } ).update({
        name, description, price, size
      }, ['id', 'name', 'description', 'price', 'size'])

      return updatedProduct;
    },

    async addProduct(root, { name, description, price, size}, context, info) {

      if (!context.user) return 'not allowed to create product';

      // match context.user.id, go through each mutation and add the verification user.id
      // creating cart
      // integrate next app with API, set up apollo client
      // how to pass authorisation header into apollo client
      // read about authorisation bearer tokens, apollo client, apollo server, authorisation versus authentication
      // hardcode login/sign up operation, get jwt token back , put token into cookie, use cookie to create a product
      // check if cookie have token in them - hydrating token in the app state from the cookies
      // request login/sign up, in next app store the token using javascript cookie
      // read from javascript Cookies, when requesting
      // using Cookies, to give next app access to them whilst server rendering

      if(context.user) {

        const customer_id = context.user;

        const [ addProduct ] = await database('products').insert({ name, description, price, size, customer_id}, [
          'name', 'description', 'price', 'size', 'customer_id' , 'id' ])
                  
        return addProduct;

      }

     
    },

    async deleteProduct(root, { id }, context, info){

      await database('products').where( { id } ).del()

      console.log('Success')

    },

    async createBasket(root, args, context){

        const [ createBasket ] = await database('basket_table').insert( { user_id : context.user && context.user.id} , [
          'id'
        ])

      return createBasket;
    },

    async signup( root, { name, email, password }, info) {

      const passwordHashed = await bcrypt.hash(password,10);

      const [ user ] = await database('user_table').insert({ name, email, password: passwordHashed}, [
        'name', 'email', 'password', 'id'])

      const token = jwt.sign( { userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1y'})

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
    
      const token = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET )
    
      // 3
      return {
        token,
        user,
      }
    }
  },
}

// const context = ({ req }) => {
//   const token = req.headers.authorization || ''

//   try {
//     const { id, email } = jwt.verify(token.replace('Bearer ', ''), ACCESS_TOKEN_SECRET)

//     return { user: { id, email }}

//   } catch (e) {
//     return { user: null };
//   }
// }


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

const getUserId = (token) => {

  const tokenNew = token.replace('Bearer', '')
  const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  return userId
}



const handler = server.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;