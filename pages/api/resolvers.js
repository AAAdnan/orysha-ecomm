require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import database from '../../database/knex';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import  { toCursorHash, fromCursorHash } from './cursorHash'

const resolvers = {
    Query: {
      products: async(parent, { pageSize = 2, cursor, name, gender, id }) => {
  
        let decodedCursor
  
        if (cursor) {
         decodedCursor = fromCursorHash(cursor);
        }
  
        const baseQuery = database.select().from('products');
  
        if (decodedCursor && !id) {
          baseQuery.where('id', '>', decodedCursor)
        }
  
        if (name) {
          baseQuery.where('name', 'like', `%${name}%`)
        }
  
        if (gender) {
          baseQuery.where('gender', 'like', `%${gender}%`)
        }

        if (id) {
          baseQuery.where('id', `${id}`)
        }
        
        const products = await baseQuery.limit(pageSize + 1)
  
        console.log('products +' + products);
  
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
      basket: async ( root, { id }, context, info ) => {

        const user_id = context.user.userId;

        const [ { id: basket_id }] = await database('basket_table').where( { user_id })

        const basket_items = await database('basket_item_table').where({ basket_table_id : basket_id  })

        let quantity = basket_items.map(a => a.basket_quantity )

        let productIds = basket_items.map(a => a.product_id )

        let first = productIds[0]

        let result = await database('products') .where( { id: first })

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        let number_basket_items = quantity.reduce(reducer);

        console.log(number_basket_items)

        return { id : id || basket_id, items: [ result ] , quantity: number_basket_items, cost: 0 }

      },
    },
  
    Mutation: {
  
      async updateProduct (root, { id, name, description, price, size}, context, info) {
  
        if (!context.user) return 'not allowed to update a product';
  
        
        const [ updatedProduct ] = await database('products').where( { id } ).update({
          name, description, price, size
        }, ['id', 'name', 'description', 'price', 'size'])
  
        return updatedProduct;
      },
  
      async addProduct(root, { name, description, price, size, image, gender}, context, info) {
  
        if (!context.user) return 'not allowed to create product';
  
        if(context.user) {
  
          const customer_id = context.user.userId;
  
          const [ addProduct ] = await database('products').insert({ name, description, price, size, customer_id, image, gender}, [
            'name', 'description', 'price', 'size', 'customer_id' , 'image', 'gender' ])
                    
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
  
  
      async addItemToBasket(root, { productId, quantity, id }, context) {
        
        const user_id = context.user.userId;

        // await database('basket_table').insert( { user_id } , [ 'user_id' ]).onConflict('user_id').ignore()

        const [ { id: basket_id } ] = await database('basket_table').where({ user_id }, [ 'user_id', 'id'])

        const [ basket_item ] = await database('basket_item_table').insert({ basket_quantity: quantity, product_id: productId, basket_table_id: basket_id }, ['basket_quantity', 'product_id', 'basket_table_id'])

        const [ basket ] = await database('basket_item_table').where({ basket_table_id : basket_id  })

        console.log(Object.values(basket)[1])

        //client sdk stripe API

        //map each item to the line item price, then reduce to do sum
        
        //load the existing basket-items if basket already exists
        //grab product by id, multiply each product price with the quantity in the basket time

        //map from database output shape to expected GraphQL schema fields

        //{ quantity: basket_item.basket_quantity } 


        return { id : id || basket_id, items: [basket_item], cost: 0 }
    
      },
  
      async signUpUser( root, { name, email, password }, info) {
  
        const [ foundUser ] = await database('user_table').where( { email })
  
        if(foundUser) throw new Error('Email already registered')
  
        const passwordHashed = await bcrypt.hash(password,10);
  
        const [ user ] = await database('user_table').insert({ name, email, password: passwordHashed}, [
          'name', 'email', 'password', 'id', 'role'])

          if (user) {
             await database('basket_table').insert( { user_id: user.id } , [ 'user_id'])
          }

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
      
        return {
          token,
          tokenExpiration: 1,
        }
      },
    },
  }

module.exports = resolvers;
