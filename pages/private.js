import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { parseCookies, setCookie, destroyCookie } from 'nookies'
const LoginPage = dynamic(() => import("../components/LoginForm"))

function Private({ loggedIn, ...props }) { 
    
    if (!loggedIn) return <LoginPage />
    
        return(
            <div className="text-sans">
            <div className="w-full text-gray-900">
              <h1 className="m-0 w-full pt-20 leading-tight text-5xl text-center text-white font-bold">
                Welcome to the Private page
              </h1>
              <div className="max-w-4xl text-white mx-auto pt-20 py-auto pb-8 flex flex-row justify-around">
                <p>Store</p>
              </div>
            </div>
          </div>
        )    
}

Private.getInitialProps = async ctx => {

    const cookies = parseCookies(ctx)

    console.log(cookies)
    
      // Destroy
      // destroyCookie(ctx, 'cookieName')

    if(!cookies) return { loggedIn: false }

    if(cookies) return { loggedIn: true}
    
}

export default Private;