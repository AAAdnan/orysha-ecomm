import React from 'react';
import Layout from "../components/Layout";
import { gql, ApolloClient, useApolloClient, useMutation } from '@apollo/client';

import LoginForm from '../components/LoginForm';


export default function Login() {
  
    return <LoginForm />;
  }

