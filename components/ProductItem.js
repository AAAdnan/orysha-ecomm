import React, { useState } from "react";
import Link from 'next/link';
import { useApolloClient } from '@apollo/client';
import ProductSingle from "../pages/store/product/[id]";

const ProductItem = props => {  
  
    return (  
      <>
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:max-w-2xl h-64 border-solid border-4 border-gray-600 bg-white rounded overflow-hidden shadow-lg">
          <div className="md:w-1/2 p-6 md:p-16">
            <img src={props.image}></img>
          </div>
          <div className="flex flex-col items-center md:items-start md:self-center md:w-1/2 ">
                <h1 className="text-black font-mono font-bold text-2xl">{ props.name }</h1>
                <h1 className="text-black text-base mb-2">£{ props.price }</h1>
              <Link href={`store/product/${props.id}`}>
                <a>
                    <button className="bg-black hover:bg-orange-600 rounded py-2 px-2 md:mt-6">
                      <p className="text-white text-sm px-8">VIEW</p>
                    </button>
                </a>
              </Link>
          </div>
        </div>
      </div>
      </>
      )
  };

  export default ProductItem;