import React from "react";
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Head from "next/head";
import Nav from '../components/Nav';

export const getServerSideProps = async ctx => {

  const cookies = parseCookies(ctx)

  console.log(cookies)
  
    // Destroy
    // destroyCookie(ctx, 'cookieName')

  if(!cookies) return { props: { loggedIn: false } }

  if(cookies) return { props: { loggedIn: true } }
  
}

const Home = (props) => {
  return(
  <div >
    <Head>
      <title>Home</title>
      <link rel="icon" href="/orysha_template.jpg" />
    </Head>
    <Nav loggedIn={props.loggedIn}/>
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row m-16">
          <div><h1 className="font-bold text-6xl text-white leading-tight px-6">Orysha</h1></div>
          <div><h1 className="font-bold text-6xl text-orange-600 leading-tight">Store</h1></div>
      </div>
      <img class="h-64 w-full object-contain" alt="african-mask" src="/orysha_mask.jpg" />
      <div className="mt-24">
        <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
        Be inspired
        </button>
      </div>
      </div>
  </div>
  )
};

export default Home;