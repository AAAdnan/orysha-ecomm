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
      <title>About</title>
      <link rel="icon" href="/orysha_template.jpg" />
    </Head>
    <Nav loggedIn={props.loggedIn}/>
    <section>
      <h2 className="text-6xl mt-12 font-bold text-center text-orange-600">
          About
      </h2>
    </section>
    <section>
      <div className="containermb-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="max-h-96 md:h-screen">
            <img src="/rsz_orysha_winged.jpg" alt="orysha_face_mask" />
          </div>
          <div className="flex bg-black p-10">
            <div className="mb-auto mt-auto max-w-lg text-center">
              <p className="text-lg text-orange-600">Orysha was founded in 2020 by two university friends. They wanted to reclaim the image of Africa myths, formerly told through the European colonial prism, and in the process estabilish a bold new fashion brand.</p>
              <Link href="/store">
                <button className="bg-orange-500 text-gray font-bold rounded-full mt-6 py-4 px-8 shadow-lg uppercase tracking-wider hover:bg-orange-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">Store</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
  </section> 
  </div>
  </>
  )
};

export default About;
