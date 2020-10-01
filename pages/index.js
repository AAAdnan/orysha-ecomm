import React from "react";
import Head from "next/head";
import Nav from "../components/nav";

const Home = () => (
  <div className="text-sans">
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="w-full text-gray-900">
      <h1 className="m-0 w-full pt-20 leading-tight text-5xl text-center text-white font-bold">
        Welcome to Orysha
      </h1>
      <p className="text-center text-white my-4 text-m">
        To get started, edit <code>pages/index.js</code> and save to reload.
      </p>

      <div className="max-w-4xl text-white mx-auto pt-20 py-auto pb-8 flex flex-row justify-around">
        <p>Store</p>
      </div>
    </div>
  </div>
);

export default Home;