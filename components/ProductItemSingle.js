import Link from 'next/Link';
import { useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'


const add_item_to_basket_mutation = gql `
  mutation($productId:String, $quantity:Int) {
    addItemToBasket(productId: $productId, quantity: $quantity) {
      items {
          product {
              name
          }
      }
    }
  }
`

const ProductItemSingle = (props) => {

    const [quantity, setQuantity] = useState(1);
    
    const { product } = props;

    const apolloClient = useApolloClient()

    const addItemToBasket = async (productId) => {
  
        const data = await apolloClient.mutate(
            {
              mutation: add_item_to_basket_mutation , variables: { productId, quantity }
            }
          )

        console.log(data)

    
    }

    
    return(
        <div className="py-6">
            <div className="flex mx-auto max-w-2xl h-1/2 border-solid border-4 border-gray-600 bg-white rounded overflow-hidden shadow-lg">
            <div className="w-1/3 p-8">
                <img className="w-full object-cover" src={product.image}></img>
            </div>
            <div className="w-2/3 p-8">
                    <h1 className="text-black font-mono font-bold text-2xl">{ product.name }</h1>
                <h1 className="text-black text-base">£{ product.price }</h1>
                <div className="flex justify-between mt-2">
                    <h1 className="text-black font-bold text-xl">Quantity</h1>
                    <select onChange={ event => setQuantity(event.target.value)} >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <p className="mt-2 mb-4 text-black text-sm">{ product.description }</p>
                    <div className="flex row justify-around">
                        <button onClick={() => addItemToBasket(product.id)} className="px-3 py-6 mt-8 bg-black hover:bg-black text-white hover:text-orange-600 text-xs font-bold uppercase rounded">Add to Cart</button>
                        <Link href="/store">
                            <a>
                                <button className="px-3 py-6 mt-8 bg-black hover:bg-black text-white hover:text-orange-600 text-xs font-bold uppercase rounded">Return to store</button>
                            </a>
                        </Link>
                    </div>
            </div>
            </div>
        </div>    
    )
    
}


export default ProductItemSingle;
