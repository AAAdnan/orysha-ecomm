import React, { useState } from "react";
import Link from 'next/Link';
import { useApolloClient } from '@apollo/client';
import ProductSingle from "../pages/store/product/[id]";

const ProductItem = props => {  
  
    return (  
      <>
      <div className="py-6">
        <div className="flex max-w-2xl h-64 border-solid border-4 border-gray-600 bg-white rounded overflow-hidden shadow-lg">
          <div className="w-1/3 p-8">
            <img className="w-full object-cover" src={props.image}></img>
          </div>
          <div className="w-1/3 p-8">
                <h1 className="text-black font-mono font-bold text-2xl">{ props.name }</h1>
              <h1 className="text-black text-base">£{ props.price }</h1>
              <Link href={`store/product/${props.id}`}>
                <a>
                    <button className="bg-black hover:bg-orange-600 rounded py-2 px-2 mt-6">
                      <span className="text-white text-sm pr-8">View Item</span><i className="fas fa-arrow-right text-white"></i>
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