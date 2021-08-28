import Link from 'next/link';
import { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';


const ADD_ITEM = gql `
  mutation($productId:String!, $quantity:Int, $id:String) {
    addItemToBasket(productId: $productId, quantity: $quantity, id: $id) {
      id, items {
          product {
              name
          }
      }
    }
  }
`

const ProductItemSingle = (props) => {

    const [quantity, setQuantity] = useState(1);

    const [ addItem, { loading, error, data }] = useMutation(ADD_ITEM);

    let guest_id, id;

    if (typeof window !== 'undefined' && !data ) {
        guest_id = localStorage.getItem('guest_id')
    }

    if (guest_id) {
        id = guest_id
    } else {
        if (data) {
            id = data.addItemToBasket.id
            console.log(data)
        }
    }


    useEffect(() => {
        if(id) {
            localStorage.setItem('guest_id', id)    
        }
    }, [id])


    const { product } = props;

    const addItemToBasket = (productId, quantity, id) => {

        addItem({ variables: { productId, quantity, id }})
    
    }
    
    return(
        <div className="flex flex-col md:flex-row border-solid border-4 border-gray-600 bg-white rounded overflow-hidden shadow-lg">
            <div className="md:w-1/2 p-6 md:p-16">
                <img className="w-full object-cover" src={product.image}></img>
            </div>
            <div className="flex flex-col items-center md:self-center md:w-1/2 ">
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
                <div className="w-full flex flex-row justify-around mt-8">
                    <button onClick={() => addItemToBasket(product.id, quantity, id)} className="px-2 py-4 bg-black hover:bg-black text-white hover:text-orange-600 text-xs font-bold uppercase rounded">Add to Cart</button>
                    <Link href="/store">
                        <button className="px-2 py-4 bg-black hover:bg-black text-white hover:text-orange-600 text-xs font-bold uppercase rounded">Return to store</button>
                    </Link>
                   
                </div>
            </div>
        </div>
    )
    
}


export default ProductItemSingle;
