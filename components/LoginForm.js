import React from 'react'
import { useForm } from "react-hook-form";
import { useApolloClient } from '@apollo/react-hooks'
import { gql, HttpLink } from 'apollo-boost'
import { setContext } from '@apollo/client/link/context';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Router from 'next/router'

const login_mutation = gql `
  mutation($email:String!, $password:String!) {
    loginUser(email: $email, password: $password) {
      token
    }
  }
`

const LoginForm = ({ loggedIn, ...props }) => {

  const apolloClient = useApolloClient()

  const { register, handleSubmit, errors } = useForm();

  let inMemoryToken;

  const onSubmit = async (data) => {

    const { email, password } = data

    const submittedData = await apolloClient.mutate(
      {
        mutation: login_mutation, variables: {
          email, password
        }
      }
    )

    inMemoryToken = submittedData.data.loginUser.token

    console.log(inMemoryToken)

    setCookie({}, 'token', inMemoryToken, {
      maxAge: 30 * 24 * 60 * 60
    } )

    if (inMemoryToken) {
      Router.push('/')
    }
  
  }


  return (
    <div className="w-full h-screen flex">
    <img src="/africa-background.jpg" alt="background" className="object-cover object-center h-screen w-6/12" />
    <div className="bg-black flex flex-col justify-center items-center w-5/12 shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-2">LOGIN</h1>
      <div className="w-1/2 text-center">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6 rounded-md shadow-sm">
          <div>
            <input ref={register} required aria-label="Email address" name="email" type="email" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Email address"></input>
            {errors.email && (<p className="font-bold text-red-900">Email is required</p>)}
          </div>
          <div className="-mt-px">
            <input ref={register}  required aria-label="Password" name="password" type="password" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Password"></input>
            {errors.password && (<p className="font-bold text-red-900">Password is required</p>)}
          </div>
        <div className="mt-6">
          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-white group-hover:text-white transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
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

