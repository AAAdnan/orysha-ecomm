import React from 'react';
import { gql, ApolloClient, useApolloClient, useMutation } from '@apollo/client';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import LoginForm from '../components/LoginForm';
import Head from "next/head";
import Nav from '../components/Nav';

export const getServerSideProps = async ctx => {

  const cookies = parseCookies(ctx)

  if(!cookies.token) return { props: { loggedIn: false } }

  if(cookies.token) return { props: { loggedIn: true } }
  
}


export default function Login(props) {
  
   
    return <>  
    <Head>
      <title>Login</title>
      <link rel="icon" href="/orysha_template.jpg" />
    </Head>
      <Nav loggedIn={props.loggedIn} />
    <LoginForm />
  </>;
  }

