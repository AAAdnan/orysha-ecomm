import Link from 'next/Link';

const ProductItemSingle = (props) => {


    const { product } = props

    const addItemToBasket = (productId) => {
  
        // const data = await apolloClient.mutate(
        //     {
        //       mutation: add_item_to_basket_mutation , variables: { productId, quantity }
        //     }
        //   )
    
      }

    return(
        <div className="py-6">
        <div className="flex mx-auto max-w-2xl h-1/2 border-solid border-4 border-gray-600 bg-white rounded overflow-hidden shadow-lg">
          <div className="w-1/3 p-8">
            <img className="w-full object-cover" src={product.image}></img>
          </div>
          <div className="w-1/3 p-8">
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
                <div className="flex justify-around">
                    <button onClick={() => addItemToBasket(product.id)} className="px-3 py-2 mt-8 bg-black text-yellow-600 text-xs font-bold uppercase rounded">Add to Cart</button>
                    <Link href="/store">
                        <button className="px-3 py-2 mt-8 bg-black text-yellow-600 text-xs font-bold uppercase rounded">Return to store</button>
                    </Link>
                </div>
          </div>
        </div>
      </div>    
    )
    
}

    
export default ProductItemSingle;
