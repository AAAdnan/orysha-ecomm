import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { gql, HttpLink } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';
import Nav from '../components/Nav';
import Head from "next/head";

export const getServerSideProps = async ctx => {

  const cookies = parseCookies(ctx)

  console.log(cookies)
  
    // Destroy
    // destroyCookie(ctx, 'cookieName')

  if(!cookies) return { props: { loggedIn: false } }

  if(cookies) return { props: { loggedIn: true } }
  
}

const PRODUCTS_QUERY = gql`
    query($limit: Int, $offset: Int){
        products(limit: $limit, offset: $offset){
            name, description, price, size,
        }
    }
`


// store in the query parameter 
// pass to graphql query


const ProductItem = props => (
    <div className="py-6">
      <div className="flex max-w-md bg-white rounded overflow-hidden shadow-lg">
      <div className="w-1/3 bg-cover" style={{backgroundImage: "url('https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"}} >
      </div>
      <div className="w-2/3 p-4">
          <h1 className="text-black font-bold text-2xl">{ props.name }</h1>
          <p className="mt-2 text-black text-sm">{ props.description }</p>
          <div className="flex item-center mt-2">
          <svg className="w-5 h-5 fill-current text-gray-700" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
          </svg>
          <svg className="w-5 h-5 fill-current text-gray-700" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
          </svg>
          <svg className="w-5 h-5 fill-current text-gray-700" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
          </svg>
          <svg className="w-5 h-5 fill-current text-gray-500" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
          </svg>
          <svg className="w-5 h-5 fill-current text-gray-500" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
          </svg>
        </div>
        <div className="flex item-center justify-between mt-3">
          <h1 className="text-black font-bold text-xl">£{ props.price }</h1>
          <h1 className="text-black font-bold text-xl">Size: { props.size }</h1>
          <button className="px-3 py-2 bg-black text-yellow-600 text-xs font-bold uppercase rounded">Add to Cart</button>
        </div>
      </div>
      </div>
    </div>
  );

const ProductList = (props) => {
    const { loading, error, data, fetchMore } = useQuery(PRODUCTS_QUERY, { variables: { limit: 2, offset:10 } } );

    console.log(data)

    if(loading) {
        return <div>Loading</div>
    }
    if (error) {
        console.log(error)
        return <div>Error!</div>;
    }
    
   return (
     <>
     <Head>
      <title>Store</title>
      <link rel="icon" href="/orysha_template.jpg" />
    </Head>
     <Nav loggedIn={props.loggedIn} />
       <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 items-center gap-4">
                { data.products.map(( { name, description, price, size   }) => (
                    <ProductItem name={name} description={description} price={price} size={size} />
            
                    )) }
            </div>
        </div>
        <button  className="group relative flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
        More
        </button>
      </>
   )
   

}

export default ProductList;
