import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { ApolloClient, InMemoryCache, gql, useMutation } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Router from 'next/router'

const SIGN_UP = gql `
  mutation($email:String!, $password:String!, $name:String!) {
    signUpUser(email: $email, password: $password, name: $name,) {
      token
    }
  }
`
const SignUpForm = ({ loggedIn, ...props }) => {

  const[ signUp, { data, loading, error }] = useMutation(SIGN_UP)

  if(data) {
    
    let inMemoryToken = data.signUpUser.token

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


  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {

    const { name, email, password } = data

    signUp({
      variables: {
        email, password, name
      }
    })
  
  }

  return (
    <div className="container relative mx-auto mt-12 mb-8 h-screen flex">
    <img src="/lion-two.jpg" alt="background" className="object-cover object-center h-screen w-full rounded-full" />
    <div className="absolute inset-0 opacity-75 bg-black flex flex-col justify-center items-center shadow-lg">
      <h1 className="text-6xl font-bold text-orange-600 mb-24">Sign Up</h1>
      <div className="w-1/2 text-center">
      <form className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6 rounded-md shadow-sm">
          <div>
            <input ref={register} aria-label="Name" name="name" type="name" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Name"></input>
          </div>
          <div>
            <input ref={register} aria-label="Email address" name="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Email address"></input>
          </div>
          <div className="-mt-px">
            <input ref={register} aria-label="Password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Password"></input>
          </div>
            <div className="mt-6">
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-white group-hover:text-white transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                </span>
                Sign Up
            </button>
            </div>
        </div>
      </form>
      </div>
    </div>
  </div>
  )
}

SignUpForm.getInitialProps = async ctx => {

  const cookies = parseCookies(ctx)

  console.log(cookies)
  
    // Destroy
    // destroyCookie(ctx, 'cookieName')

  if(!cookies) return { loggedIn: false }

  if(cookies) return { loggedIn: true}
  
}

export default SignUpForm;