import React, { useState } from "react";
import Link from 'next/Link';
import { useApolloClient } from '@apollo/client';
import ProductSingle from "../pages/store/product/[id]";

const ProductItem = props => {

    const apolloClient = useApolloClient()
  
    const [quantity, setQuantity] = useState(1);
    
    const addItemToBasket = (productId) => {
  
      // const data = await apolloClient.mutate(
      //     {
      //       mutation: add_item_to_basket_mutation , variables: { productId, quantity }
      //     }
      //   )
  
      console.log(quantity)
    }
  
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
              <div className="flex justify-between mt-2">
                <h1 className="text-black font-bold text-xl">Quantity</h1>
                  <select onChange={ event => setQuantity(event.target.value)} >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
              </div>
              <Link href={`store/product/${props.id}`}>
                <a>
                    <p className="mt-2 mb-4 text-black text-sm">{ props.description }</p>
                    <span className="text-orange-600 text-sm pr-8">View Item</span><i className="fas fa-arrow-right"></i>
                </a>
              </Link>
          </div>
        </div>
      </div>
      </>
      )
  };

  export default ProductItem;