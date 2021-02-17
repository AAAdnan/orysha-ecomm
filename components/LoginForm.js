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
        <form className="md:w-1/2 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-6 rounded-md shadow-sm">
            <div>
              <input ref={register} required aria-label="Email address" name="email" type="email" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Email address"></input>
              {errors.email && (<p className="font-bold text-red-900">Email is required</p>)}
            </div>
            <div>
              <input ref={register}  required aria-label="Password" name="password" type="password" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Password"></input>
              {errors.password && (<p className="font-bold text-red-900">Password is required</p>)}
            </div>
          <div className="mt-6">
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-black hover:text-orange-600 transition delay-150">
              LOGIN
            </button>
          </div>
          </div>
        </form>
      </div>
  </div>
  )
}



export default LoginForm;

