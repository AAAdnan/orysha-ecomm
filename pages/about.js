import React from "react";
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Head from "next/head";
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Link from 'next/link'


export const getServerSideProps = async ctx => {

  const cookies = parseCookies(ctx)

  if(!cookies.token) return { props: { loggedIn: false } }

  if(cookies.token) return { props: { loggedIn: true } }
  
}

const About = (props) => {

  return(
  <>
  <div >
    <Head>
      <title>Home</title>
      <link rel="icon" href="/orysha_template.jpg" />
    </Head>
    <Nav loggedIn={props.loggedIn}/>
    <section class="container mx-auto bg-black">
      <div class="container mx-auto px-6 py-20">
        <h2 class="text-4xl font-bold text-center text-orange-600 mb-8">
          Testimonials
        </h2>
        <div class="flex flex-wrap">
          <div class="w-full md:w-1/3 px-2 mb-4">
            <div class="bg-white rounded shadow py-2">
              <p class="text-gray-800 text-base px-6 mb-5">Monitoring and tracking my health vitals anywhere I go and on any platform I use has never been easier.</p>
              <p class="text-gray-500 text-xs md:text-sm px-6">John Doe</p>
            </div>
          </div>
          <div class="w-full md:w-1/3 px-2 mb-4">
            <div class="bg-white rounded shadow py-2">
              <p class="text-gray-800 text-base px-6 mb-5">As an Athlete, this is the perfect product for me. I wear my Smart Health Monitoring Wristwatch everywhere I go, even in the bathroom since it's waterproof.</p>
              <p class="text-gray-500 text-xs md:text-sm px-6">Jane Doe</p>
            </div>
          </div>
          <div class="w-full md:w-1/3 px-2 mb-4">
            <div class="bg-white rounded shadow py-2">
              <p class="text-gray-800 text-base px-6 mb-5">I don't regret buying this wearble gadget. One of the best gadgets I own!.</p>
              <p class="text-gray-500 text-xs md:text-sm px-6">James Doe</p>
            </div>
          </div>
        </div>
      </div>
  </section>
  <section className="bg-black container mx-auto" >
    <div class="container mx-auto px-6 text-center py-20">
      <h2 class="mb-6 text-4xl font-bold text-center text-white">
        Limited in Stock
      </h2>
      <h3 class="my-4 text-2xl text-white">
        Be inspired
      </h3>
      <Link href="/store">
    
      <button
        class="bg-orange-500 text-gray font-bold rounded-full mt-6 py-4 px-8 shadow-lg uppercase tracking-wider hover:bg-orange-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
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

export default About;