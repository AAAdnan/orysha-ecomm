import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/react-hooks'
import { gql, HttpLink } from 'apollo-boost'
import { setContext } from '@apollo/client/link/context';


const login_mutation = gql `
  mutation($email:String!, $password:String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' })


// put response into localStorage
// put token into cookie
// app.js put headers as apollo-link
// update ApolloClient in memory to use as a bearer token
// pass headers in a context object when client is used
// set link function to hold http headers 

//replace localStorage with jscookie


const LoginForm = () => {

  const apolloClient = useApolloClient()

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, setLogin] = useState('true')

  let inMemoryToken;

  const submitForm = async (event) => {
    event.preventDefault()

   const data = await apolloClient.mutate(
      {
        mutation: login_mutation, variables : {
          email,
          password
        }
      }
    )

    inMemoryToken = data.data.login.token

    localStorage.setItem('authToken', inMemoryToken)

  setContext((_, { headers }) => {
    return {
     headers: {
        ...headers,
        Authorization: inMemoryToken ? `Bearer ${inMemoryToken}` : "",
      }
    }
  });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
      <div>
       
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={submitForm}>
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
          Sign in to your account
        </h2>
          <div className="mt-6 rounded-md shadow-sm">
            <div>
              <input onChange={event => setEmail(event.target.value)} aria-label="Email address" name="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Email address"></input>
            </div>
            <div className="-mt-px">
              <input onChange={event => setPassword(event.target.value)} aria-label="Password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Password"></input>
            </div>
          <div className="mt-6">
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              Sign in
            </button>
          </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm;