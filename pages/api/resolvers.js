require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import database from '../../database/knex';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import  { toCursorHash, fromCursorHash } from './cursorHash'
import { stripe } from './stripe'

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

        console.log(context)

        const user_id = context.user.userId;

        const [ user ] = await database('user_table').where({ id: user_id })

        return user;

      },
      basket: async ( root , { id } , context, info ) => {

        let user_id, basket_id;

        if (context.user) {
          user_id = context.user.userId;
        }

        if(!id) {
          [{ id: basket_id }] = await database('basket_table').where({ user_id })
        } else {
          basket_id = id;
        }
        
        const basket_items = await database('basket_item_table').join('products', 'products.id', 'basket_item_table.product_id').select('product_id', 'basket_item_table.id', 'image', 'basket_quantity','price', 'name', 'description').where({ basket_table_id: basket_id })

        let quantity

        const[ { status } ] = await database('basket_table').where({ id: basket_id })

        let sum = basket_items.map(p => p.price * p.basket_quantity).reduce((a,b) => a + b)

        return { id: basket_id, items: basket_items , quantity: quantity, cost: sum, status }

      },
      order: async ( root, { id }, context, info ) => {

        let user_id, basket_id;

        if (context.user) {
          user_id = context.user.userId;
        }

        if(!id) {
          [{ id: basket_id }] = await database('basket_table').where({ user_id })
        } else {
          basket_id = id;
        }

        const [ basket ] = await database('basket_table').where({ id: id })

        const { date, status } = basket

        const basket_items = await database('basket_item_table').join('products', 'products.id', 'basket_item_table.product_id').select('image', 'basket_quantity', 'price', 'name', 'description' ).where({ basket_table_id: basket_id })

        let sum = basket_items.map(p => p.price * p.basket_quantity).reduce((a,b) => a + b)

        let newDate = new Date(date).toISOString()

        return { id: basket_id, items: basket_items, date: newDate , status, cost: sum }

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
      async addItemToBasket(root, { productId, quantity, id  }, context) {

        let basket_id;

        if (context.user && context.user.userId) {

          const user_id = context.user.userId;

          let [ existing_basket ] = await database('basket_table').where({ user_id: user_id})

          if (!existing_basket) {
            [ existing_basket ] = await database('basket_table').insert({ user_id: user_id }, [ 'id' ])
  
           }

           basket_id = existing_basket.id;

        } else {

          let guest_basket;

          if(id) {
            [ guest_basket ] = await database('basket_table').where({ id: id }, [ 'id' ])
          } else {
            [ guest_basket ] = await database('basket_table').insert({ }, [ 'id' ])
          }

          basket_id = guest_basket.id;

        }

        await database('basket_item_table').insert({ basket_quantity: quantity, product_id: productId, basket_table_id: basket_id }, ['basket_quantity', 'product_id', 'basket_table_id'])

        const basket_items = await database('basket_item_table').join('products', 'products.id', 'basket_item_table.product_id').select('product_id', 'basket_item_table.id', 'image', 'basket_quantity','price', 'name', 'description').where({ basket_table_id: basket_id })

        let sum = basket_items.map(p => p.price * p.basket_quantity).reduce((a,b) => a + b)

        return { id : id || basket_id, items: basket_items, cost: sum }
    
      },
      async updateBasketItem(root, { id, operation }, context, info){

        console.log(operation)

        switch(operation){
          case 'INCREMENT':
            console.log('order updated')
            await database('basket_item_table').where({ id }).increment({ basket_quantity: 1 })
            break;
          case 'DECREMENT':
            await database('basket_item_table').where({ id }).decrement({ basket_quantity: 1 })
            break;
          case 'RESET':
            await database('basket_item_table').where({ id }).update({ basket_quantity: 1 })
          case 'REMOVE':
            await database('basket_item_table').where({ id }).del()
        }

      },
      async checkoutBasket(root , { id, token } , context, info) {

        const basket_items = await database('basket_item_table').join('products', 'products.id', 'basket_item_table.product_id').select('product_id', 'basket_item_table.id', 'image', 'basket_quantity','price', 'name', 'description').where({ basket_table_id: id })

        let sum = (basket_items.map(p => p.price * p.basket_quantity).reduce((a,b) => a + b)*100)

        const charge = await stripe.charges.create({ 
          amount: sum,
          currency: 'usd',
          description: 'Purchased: ',
          source: token,
        })

        if (charge) {

          await database('basket_table').where({ id }).update({ chargeID: charge.id, status: 'completed', date: charge.created })

        }

        return {
          orderId: charge.id
        }

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
