import React, { useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { data } from 'autoprefixer';

const CREATE_TRANSACTION = gql `
  mutation($id:ID, $token: String! ) {
    checkoutBasket(id: $id, token: $token ) {
        orderId
    }
  }
`

//send token in mutation
//initialise stripe with secret key
//resolver sends token to stripe , login in resolver
//creates transaction 
// set up the database on AWS, but deploy next app on vercel

const TakeMoney = (props) => {

    const [ createTransaction , {  data: dataCheckoutTransaction }] = useMutation(CREATE_TRANSACTION)

    const router = useRouter()

    useEffect(() => {
        if (dataCheckoutTransaction && dataCheckoutTransaction.checkoutBasket.orderId ) {
            router.push('/order')
        } 
    } , [dataCheckoutTransaction, router] )

    let id;

    const checkout = (token, id ) => {

        let stripeToken = token.id;

        id = props.basketId;
  
        createTransaction({
        variables: { id, token: stripeToken },
        })

    }
    

    return (
        <>
      <StripeCheckout
        name="Orysha"
        description="Be Divine"
        image="/orysha_template.jpg"
        currency="GBP"
        label="CHECKOUT"
        stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE}
        token={token => checkout(token, id)}
      />
      </>
    )

}
 
export default TakeMoney;