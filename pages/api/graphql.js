require('dotenv').config()
import { ApolloServer, gql, AuthenticationError } from "apollo-server-micro";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import database from '../../database/knex';


const typeDefs = gql`
  type Product {
    id: ID!,
    name: String,
    description: String,
    price: String,
    size: String,
    user: User
  }
  type User {
    name: String!,
    email: String!
  }
  type Basket {
    id: String!,
    user: User,
    items: [BasketItem],
    quantity: Int,
    displayPrice: Int
  }
  type BasketItem {
      product: Product,
      quantity: Int 
  }
  type Query {
    products: [Product]
  }
  type Mutation {
    updateProduct(id: Int!, name: String!, description: String, price: String, size: String): Product
    addProduct(name: String!, description: String!, price: String!, size: String!): Product
    deleteProduct(id: Int!): Product
    createBasket: Basket
    #updateQuantity
    #check jwt is present in all headers, update product resolvers to check if authorisation header is present, check products belong to user(need to have jwt), update product (need to have jwt, id needs to match)
    signup (username: String!, email:String!, password: String! ): String
    login (email: String!, password: String! ): String
  }
`;

const resolvers = {
  Query: {
    products: async () => {
      const products = await database.select().from('products')
      return products
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

      const [ addProduct ] = await database('products').insert({ name, description, price, size}, [
        'name', 'description', 'price', 'size'])
      
      return addProduct;
    },

    async deleteProduct(root, { id }, context, info){

      await database('products').where( { id } ).del()

      console.log('Success')

    },

    async createBasket(root, { user_id }){

      const [ createBasket ] = await database('basket_table').insert({ user_id }, [
        'user_id'
      ])

      return createBasket;
    },

    async signup( root, { name, email, password }, context, info) {

      const passwordHashed = bcrypt.hash(password);

      const [ user ] = await database('user_table').insert({ name, email, password: passwordHashed}, [
        'name', 'email', 'password'])

      const userObject = { id: user.id, email: user.email }

        return jwt.sign(
          userObject,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1y'}
        )    
    },

    async login (_, { email, password }) {
      const user = await database('user_table').where( { email })

      if (!user) {
        throw new Error('invalid credentials')
      }

      const valid = bcrypt.compare(password, user.password)

      if (!valid) {
        throw new Error('invalid credentials')
      }

      const userObject = { id: user.id, email: user.email }

      return jwt.sign(
        userObject,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1y'}
      ) 

      
    }
  },
}

// const context = ({ req }) => {
//   const token = req.cookies['jwt'] || ''
//   try {
//     return { id, email } = jwt.verify(token, ACCESS_TOKEN_SECRET)
//   } catch (e) {
//     throw new AuthenticationError(
//       'Authentication token is invalid, please login'
//     )
//   }
// }

const server = new ApolloServer({ typeDefs, resolvers, corse: false });

const handler = server.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;