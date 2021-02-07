import React from 'react'
import { useForm } from "react-hook-form";
import { ApolloClient, InMemoryCache, gql, useMutation } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Router from 'next/router'

const LOGIN = gql `
  mutation($email:String!, $password:String!) {
    loginUser(email: $email, password: $password) {
      token
    }
  }
`

const LoginForm = ({ loggedIn, ...props }) => {

  const { register, handleSubmit, errors } = useForm();

  const[ login, { data, loading, error }] = useMutation(LOGIN)


  if(data) {
    
    let inMemoryToken = data.loginUser.token

    console.log(inMemoryToken)

    localStorage.removeItem('guest_id')

    setCookie({}, 'token', inMemoryToken, {
      maxAge: 30 * 24 * 60 * 60
    })

    setContext((_, { headers }) => {
      return {
       headers: {
          ...headers,
          Authorization: inMemoryToken ? `Bearer ${inMemoryToken}` : "",
        }
      }
    });

    if (inMemoryToken) {
      Router.push('/')
    }

  }


  const onSubmit = async (data) => {

    const { email, password } = data

    login({
      variables: {
        email, password
      }
    })

  }


  return (
    <div className="container mx-auto relative mt-8 h-screen flex mb-12">
      <img src="/africa-background.jpg" alt="background" className="z-0 bg-cover bg-center rounded-full"/>
      <div className="z-10 absolute inset-0 bg-black opacity-75 flex flex-col justify-center items-center shadow-lg">
        <h1 className="text-6xl font-bold text-orange-600 mb-24">Login</h1>
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
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-black bg-orange-600 hover:bg-orange-800 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-black group-hover:text-white transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
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

