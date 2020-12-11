import Link from 'next/Link';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';


const ADD_ITEM = gql `
  mutation($productId:String!, $quantity:Int) {
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

    let userLoggedIn = props.loggedIn;

    // if (!userLoggedIn) {
    //     localStorage.setItem('id', timestamp )
    // }

    const [quantity, setQuantity] = useState(1);

    const [ addItem, { loading, error, data }] = useMutation(ADD_ITEM);

    const { product } = props;

    const addItemToBasket = (productId, quantity) => {

        addItem({ variables: { productId, quantity }})
    
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
                    <select onChange={ event => setQuantity(parseInt(event.target.value))} >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <p className="mt-2 mb-4 text-black text-sm">{ product.description }</p>
                    <div className="flex row justify-around">
                        <button onClick={() => addItemToBasket(product.id, quantity)} className="px-3 py-6 mt-8 bg-black hover:bg-black text-white hover:text-orange-600 text-xs font-bold uppercase rounded">Add to Cart</button>
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
