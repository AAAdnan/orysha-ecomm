import React from "react";
import Head from "next/head";

const Home = () => (
  <div className="text-sans">
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="text-center md:text-left md:flex flex-col max-w-3xl mx-auto mt-24 space-x-3">
      <h1 className="font-bold text-6xl text-white leading-tight mx-auto">Orysha Store</h1>
      <div className="mt-24">
        <p className="text-xl font-light text-white mx-auto">
        Choose your own brand of inspired African clothing
        </p>
      </div>
    </div>
  </div>
);

export default Home;