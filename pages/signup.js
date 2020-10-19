import React from 'react';
import { gql, ApolloClient, useApolloClient, useMutation } from '@apollo/client';
import Head from "next/head";
import Nav from '../components/Nav';


import SignUpForm from '../components/SignUpForm';

export default function SignUp() {

          
    return <>
    <Head>
      <title>Sign Up</title>
      <link rel="icon" href="/orysha_template.jpg" />
    </Head>
      <Nav/>
    <SignUpForm />
    </>;
  }

