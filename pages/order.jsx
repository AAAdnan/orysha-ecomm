import React from "react";
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Head from "next/head";
import Nav from '../components/Nav';
import Link from 'next/link'
import { gql, useQuery, useMutation, useState } from '@apollo/client';
import TakeMoney from '../components/StripeCheckout';

export const getServerSideProps = async ctx => {

  const cookies = parseCookies(ctx)

  if(!cookies.token) return { props: { loggedIn: false } }

  if(cookies.token) return { props: { loggedIn: true } }
  
}

const GET_BASKET = gql `
    query($id: ID, $user: Int, $cost: Int, $quantity: Int) {
      basket(id: $id, user: $user, cost: $cost, quantity: $quantity) {
        id, status, quantity, cost, items {
          name, description, image, size, price, basket_quantity, id
      }
    }
  }
`

const UPDATE_BASKET = gql `
  mutation($id:ID!, $operation: BasketItemOperations!) {
    updateBasketItem(id: $id, operation: $operation) {
      basket_quantity
    }
  }
`

const CartQuery = (props) => { 

  let guest_basket_id;

  if (typeof window !== 'undefined') {
    guest_basket_id = localStorage.getItem('guest_id')
  }


  const { data, error, loading, fetchMore } = useQuery(GET_BASKET, { 
    variables: { id: guest_basket_id }
   });

  const [ updateBasketItem, {  data: dataChangeItem }] = useMutation(UPDATE_BASKET)

  let basket_id, quantity, cost, items;

  if (data && data.basket) {

    quantity = data.basket.quantity

    cost = data.basket.cost

    items = data.basket.items

    basket_id = data.basket.id

  } else {
    items = [];
  }

  const updateBasket = (id, operation) => {
    
    updateBasketItem({
      variables: { id, operation},
      refetchQueries: [{ query: GET_BASKET, variables: { id: guest_basket_id }} ]
    })

  }




  return(
  <>
    <Head>
      <title>Order</title>
      <link rel="icon" href="/orysha_template.jpg" />
    </Head>
    <Nav loggedIn={props.loggedIn}/>
    <div className="container mx-auto mt-10">
      <CartList items={items} updateBasket={updateBasket} basket_id={basket_id} quantity={quantity} cost={cost} />
    </div>
  </>
  )
};

const CartList = (props) => {

  const { items, quantity, cost, updateBasket, checkoutBasketClick, basket_id } = props;
  
  console.log(basket_id)

  return (
    <>
    <div className="flex shadow-md my-10">
           <div className="w-full bg-orange-300 px-10 py-10 rounded-lg">
            <div className="flex justify-center border-b pb-8">
              <h1 className="font-semibold text-4xl py-4">Completed Orders</h1>
            </div>
           <div className="flex mt-10 mb-5">
             <h3 className="font-semibold text-xs uppercase w-1/5">Product Details</h3>
             <h3 className="font-semibold text-center text-xs uppercase w-1/5 text-center">Quantity</h3>
             <h3 className="font-semibold text-center text-xs uppercase w-1/5 text-center">Price</h3>
             <h3 className="font-semibold text-center text-xs uppercase w-1/5 text-center">Date</h3>
             <h3 className="font-semibold text-center text-xs uppercase w-1/5 text-center">Total</h3>
           </div>
           {items.map(({name, description, image, price, basket_quantity, id}) => (
               <div className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5" key={id}>
               <div className="flex w-1/5">
                    <div className="w-20">
                    <img className="h-24" src={image} alt="" />
                   </div>
                  <div className="flex flex-col justify-between ml-4 flex-grow">
                    <span className="font-bold text-sm">{name}</span>
                    <span className="text-red-500 text-xs">{description}</span>
                  </div>
               </div>
               <div className="flex justify-center w-1/5">
                 <input className="mx-2 border text-center w-8" type="text" value={basket_quantity} placeholder="1"/>
               </div>
               <span className="text-center w-1/5 font-semibold text-sm">${price}</span>
               <span className="text-center w-1/5 font-semibold text-sm">${price * basket_quantity}</span>
             </div>
           ))}
           <Link href="/store">
               <a className="flex font-semibold text-indigo-600 text-sm mt-10">
               <svg className="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z"/></svg>
               Continue Shopping
               </a>
           </Link>
         </div>
    </div>
    </>
  )
}

export default CartQuery;