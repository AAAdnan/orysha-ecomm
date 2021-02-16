import React from "react";
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Head from "next/head";
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client';


export const getServerSideProps = async ctx => {

  const cookies = parseCookies(ctx)

  if(!cookies.token) return { props: { loggedIn: false } }

  if(cookies.token) return { props: { loggedIn: true } }
  
}

const Home = (props) => {

  return(
  <>
  <div >
    <Head>
      <title>Home</title>
      <link rel="icon" href="/orysha_template.jpg" />
    </Head>
    <Nav loggedIn={props.loggedIn}/>
    <div className="container mx-auto py-20 mt-12" style={{background: "linear-gradient(90deg, rgba(36,0,0,1) 0%, rgba(235,140,1,1) 43%, rgba(255,147,0,1) 68%, rgba(121,98,9,1) 100%)" }}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-2 text-white">
         ORYSHA CLOTHING
        </h2>
        <h3 className="text-2xl mb-8 text-gray-200">
          Divine products
        </h3>
        <Link href="/store">
          <button className="bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider">
            Pre Order
          </button>
        </Link>
      </div>
    </div>
    <section className="container mx-auto px-6 p-10">
      <h2 className="text-6xl font-bold text-center text-orange-600 mb-8">
        Orysha Store
      </h2>
      <div className="flex items-center flex-wrap mb-8">
        <div className="w-full md:w-1/2">
          <h4 className="text-center text-3xl text-orange-600 font-bold mb-3">Fashion</h4>
          <p className="text-center text-white">Embrace the power of the ancient Orysha with our range of themed clothing. 
          </p>
        </div>
        <div className="w-full md:w-1/2">
         <img className="h-64 w-full object-contain" alt="african-angel" src="/rsz_orysha_winged.jpg"></img>
        </div>
      </div>
      <div className="flex items-center flex-wrap mb-8">
        <div className="w-full md:w-1/2">
         <img className="h-64 w-full object-contain" alt="african-mask" src="/orysha_mask.jpg"></img>
        </div>
        <div className="w-full md:w-1/2">
          <h4 className="text-center text-3xl text-orange-600 font-bold mb-3">Unique</h4>
          <p className="text-center text-white">
            Each Orysha represents a specific quality - strength, kindness, feminity, power. Which Orysha matches your personality?
          </p>
        </div>
      </div>
      <div className="flex items-center flex-wrap mb-8">
        <div className="w-full md:w-1/2">
          <h4 className="text-center text-3xl text-orange-600 font-bold mb-3">Taste</h4>
          <p className="text-center text-white">
          Explore our range of custom jackets, tracksuits and snapback hats now.
          </p>
        </div>
        <div className="w-full md:w-1/2">
         <img className="h-64 w-full object-contain" alt="african-mask" src="/rsz_orysha_woman_mask.jpg"></img>
        </div>
      </div>
    </section>
    <section className="container mx-auto bg-black border-solid border-4 border-orange-600">
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-orange-600 mb-8">
          Testimonials
        </h2>
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/3 px-2 mb-4">
            <div className="bg-black rounded shadow py-2 border-solid border-2 border-white">
              <p className="text-white text-center text-base px-6 mb-5">The perfect cap - a dream match for my style. </p>
              <p className="text-orange-600 text-center text-xs md:text-sm px-6">John Doe</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4">
            <div className="bg-black rounded shadow py-2 border-solid border-2 border-orange-600">
              <p className="text-center text-white text-base px-6 mb-5">The handbags are classy and unique, all of my friends ask where I got them.</p>
              <p className="text-center text-orange-600 text-xs md:text-sm px-6">Jane Doe</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4">
            <div className="bg-black rounded shadow py-2 border-solid border-2 border-white">
              <p className="text-center text-white text-base px-6 mb-5">Totally unique</p>
              <p className="text-center text-orange-600 text-xs md:text-sm px-6">James Doe</p>
            </div>
          </div>
        </div>
      </div>
  </section>
  <section className="bg-black container mx-auto" >
    <div className="container mx-auto px-6 text-center py-20">
      <h2 className="mb-6 text-4xl font-bold text-center text-orange-600">
        Limited in Stock
      </h2>
      <h3 className="my-4 text-2xl text-white">
        Be inspired
      </h3>
      <Link href="/store">
    
      <button
        className="bg-orange-500 text-gray font-bold rounded-full mt-6 py-4 px-8 shadow-lg uppercase tracking-wider hover:bg-orange-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
      >
        Pre Order
      </button>
  
      </Link>
    </div>
  </section>
  </div>
  </>
  )
};

export default Home;