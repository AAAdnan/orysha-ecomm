import React from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';

const user_query = gql `
  query($email:String!, $password:String!, $name:String!) {
    signup(email: $email, password: $password, name: $name,) {
      token
    }
  }
`

export const UserProvider = props => {
    console.log('testing')
};

export const getServerSideProps = async ctx => {

    const cookies = parseCookies(ctx)
  

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
      
     
  
    if(!cookies) return { props: { loggedIn: false } }
  
    if(cookies) return { props: { loggedIn: true } }

}
    