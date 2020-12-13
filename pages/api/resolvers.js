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
      findUser: async( parent, args, context, info ) => {

        const user_id = context.user.userId;

        const [ user ] = await database('user_table').where({ id: user_id })

        return user;

      },
      basket: async ( root, { id }, context, info ) => {

        const user_id = context.user.userId;

        const [ { id: basket_id }] = await database('basket_table').where( { user_id })

        const basket_items = await database('basket_item_table').join('products', 'products.id', 'basket_item_table.product_id').select('product_id', 'basket_item_table.id', 'image', 'basket_quantity','price', 'name', 'description').where({ basket_table_id: basket_id })

        let quantity = basket_items.reduce((a, {basket_quantity}) => a + basket_quantity, 0);

        let sum = basket_items.map(p => p.price * p.basket_quantity).reduce((a,b) => a + b)

        return { id : id || basket_id, items: basket_items , quantity: quantity, cost: sum }

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
  
  
      async addItemToBasket(root, { productId, quantity  }, context) {

        const user_id = context.user.userId;

        let existing_basket;

        let new_basket;

        let basket_id;

        if (user_id) {
          [ existing_basket ] = await database('basket_table').where({ user_id: user_id})

          basket_id = existing_basket.id

         if (!existing_basket) {
          [ new_basket ] = await database('basket_table').insert({ user_id: user_id }, [ 'id' ])

          basket_id = new_basket.id

         }
  
        }

        // status string on basket_table

        const [ basket_item ] = await database('basket_item_table').insert({ basket_quantity: quantity, product_id: productId, basket_table_id: basket_id }, ['basket_quantity', 'product_id', 'basket_table_id'])

        //client sdk stripe API

        //map each item to the line item price, then reduce to do sum
    
        return { id : id || basket_id, items: [basket_item], cost: 0 }
    
      },
      async removeItemFromBasket(root, { id }, context, info) {

        console.log(id)

        const user_id = context.user.userId;

        await database('basket_item_table').where({ id: id }).del()

        return ('item deleted')

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
      
        return {
          token,
          tokenExpiration: 1,
        }
      },
    },
  }

module.exports = resolvers;
