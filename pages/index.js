import React from "react";
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Head from "next/head";
import Nav from '../components/Nav';
import { useQuery, gql } from '@apollo/react-hooks';

const GET_USER = gql `
   query{
     me {
       id,
       name
     }
   }
`


export const getServerSideProps = async ctx => {

  const cookies = parseCookies(ctx)


  console.log(cookies)

    // Destroy
    // destroyCookie(ctx, 'cookieName')

  if(!cookies) return { props: { loggedIn: false } }

  if(cookies) return { props: { loggedIn: true } }
  
}

const Home = (props) => {

  const { data, loading, fetchMore } = useQuery(GET_USER);

  console.log(data)

  return(
  <div >
    <Head>
      <title>Home</title>
      <link rel="icon" href="/orysha_template.jpg" />
    </Head>
    <Nav loggedIn={props.loggedIn}/>
    <div class="container mx-auto py-20 mt-12" style={{background: "linear-gradient(90deg, rgba(36,0,0,1) 0%, rgba(235,140,1,1) 43%, rgba(255,147,0,1) 68%, rgba(121,98,9,1) 100%)" }}>
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold mb-2 text-white">
         ORYSHA CLOTHING
        </h2>
        <h3 class="text-2xl mb-8 text-gray-200">
          Divine products
        </h3>
        <button class="bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider">
          Pre Order
        </button>
      </div>
    </div>
    <section class="container mx-auto px-6 p-10">
      <h2 class="text-6xl font-bold text-center text-orange-600 mb-8">
        Orysha Store
      </h2>
      <div class="flex items-center flex-wrap mb-20">
        <div class="w-full md:w-1/2">
          <h4 class="text-3xl text-white font-bold mb-3">Snapback Caps</h4>
          <p class="text-white mb-8">Our Smart Health Monitoring Wristwatch is able to capture you vitals while you exercise. You can create different category of exercises and can track your vitals on the go.</p>
        </div>
        <div class="w-full md:w-1/2">
          <img src="assets/health.svg" alt="Monitoring" />
        </div>
      </div>
      <div class="flex items-center flex-wrap mb-20">
        <div class="w-full md:w-1/2">
          <img src="assets/report.svg" alt="Reporting" />
        </div>
        <div class="w-full md:w-1/2 pl-10">
          <h4 class="text-3xl text-white font-bold mb-3">Style</h4>
          <p class="text-white mb-8">Our Smart Health Monitoring Wristwatch can generate a comprehensive report on your vitals depending on your settings either daily, weekly, monthly, quarterly or yearly.</p>
        </div>
      </div>
      <div class="flex items-center flex-wrap mb-20">
        <div class="w-full md:w-1/2">
          <h4 class="text-3xl text-gray-800 font-bold mb-3">Fashion</h4>
          <p class="text-white mb-8">Our Smart Health Monitoring Wristwatch allows you to sync data across all your mobile devices whether iOS, Android or Windows OS and also to your laptop whether MacOS, GNU/Linux or Windows OS.</p>
        </div>
        <div class="w-full md:w-1/2">
         <img className="h-64 w-full object-contain" alt="african-mask" src="/orysha_mask.jpg"></img>
        </div>
      </div>
    </section>
    <section class="container mx-auto bg-gray-100">
      <div class="container mx-auto px-6 py-20">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-8">
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
      <button
        class="bg-orange-500 text-gray font-bold rounded-full mt-6 py-4 px-8 shadow-lg uppercase tracking-wider hover:bg-orange-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
      >
        Pre Order
      </button>
    </div>
  </section>
  <footer class="container mx-auto bg-gray-100">
  <div class="container mx-auto px-6 pt-10 pb-6">
    <div class="flex flex-wrap">
      <div class="w-full md:w-1/4 text-center md:text-left">
        <h5 class="uppercase mb-6 font-bold">Links</h5>
        <ul class="mb-4">
          <li class="mt-2">
            <a href="#" class="hover:underline text-gray-600 hover:text-orange-500">FAQ</a>
          </li>
          <li class="mt-2">
            <a href="#" class="hover:underline text-gray-600 hover:text-orange-500">Help</a>
          </li>
          <li class="mt-2">
            <a href="#" class="hover:underline text-gray-600 hover:text-orange-500">Support</a>
          </li>
        </ul>
      </div>
      <div class="w-full md:w-1/4 text-center md:text-left">
        <h5 class="uppercase mb-6 font-bold">Legal</h5>
        <ul class="mb-4">
          <li class="mt-2">
            <a href="#" class="hover:underline text-gray-600 hover:text-orange-500">Terms</a>
          </li>
          <li class="mt-2">
            <a href="#" class="hover:underline text-gray-600 hover:text-orange-500">Privacy</a>
          </li>
        </ul>
      </div>
      <div class="w-full md:w-1/4 text-center md:text-left">
        <h5 class="uppercase mb-6 font-bold">Social</h5>
        <ul class="mb-4">
          <li class="mt-2">
            <a href="#" class="hover:underline text-gray-600 hover:text-orange-500">Facebook</a>
          </li>
          <li class="mt-2">
            <a href="#" class="hover:underline text-gray-600 hover:text-orange-500">Linkedin</a>
          </li>
          <li class="mt-2">
            <a href="#" class="hover:underline text-gray-600 hover:text-orange-500">Twitter</a>
          </li>
        </ul>
      </div>
      <div class="w-full md:w-1/4 text-center md:text-left">
        <h5 class="uppercase mb-6 font-bold">Company</h5>
        <ul class="mb-4">
          <li class="mt-2">
            <a href="#" class="hover:underline text-gray-600 hover:text-orange-500">Official Blog</a>
          </li>
          <li class="mt-2">
            <a href="#" class="hover:underline text-gray-600 hover:text-orange-500">About Us</a>
          </li>
          <li class="mt-2">
            <a href="#" class="hover:underline text-gray-600 hover:text-orange-500">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>
  </div>
  )
};

export default Home;