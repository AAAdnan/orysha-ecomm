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
      <h1 className="text-6xl roboto font-bold text-orange-600 mb-24">Sign Up</h1>
      <div className="md:w-1/2 text-center">
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
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-black hover:text-orange-600 transition delay-150">
                SIGN UP
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