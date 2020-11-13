import React, { useState, useEffect, useRef } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { gql, HttpLink } from 'apollo-boost'
import { useApolloClient } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';
import Nav from '../components/Nav';
import Head from "next/head";
import { useRouter } from 'next/router'
import usePageBottom from '../utils/usePageBottom';

export const getServerSideProps = async ctx => {

  const cookies = parseCookies(ctx)

  console.log(cookies)

  if(!cookies) return { props: { loggedIn: false } }

  if(cookies) return { props: { loggedIn: true } }
  
}

const GET_PRODUCTS = gql `
    query($pageSize: Int, $cursor: String, $name: String, $gender: String) {
      products(pageSize: $pageSize, cursor: $cursor, name: $name, gender: $gender) {
        edges {
          node {
            name
            description
            price
            size
            image
          }
        }
        pageInfo {
          endCursor
        }
      }
    }
`

const create_basket_mutation = gql `
  mutation{
    createBasket{
      id
    }
  }

`

const add_item_to_basket_mutation = gql `
  mutation {
    addItemToBasket{
      id
    }
  }
`

const ProductQuery = (props) => {

  const router = useRouter();

  const { data, error, loading, fetchMore } = useQuery(GET_PRODUCTS, { variables: { name: router.query.name, gender: router.query.gender }} );

  console.log(data);

  const isPageBottom = usePageBottom();

  useEffect(() => {
    if (!isPageBottom || !data ) return;
  
    click()
  
    console.log('this is the bottom')
  
  }, [isPageBottom, fetchMore, data ])


  let products;

  if(data && data.products && Array.isArray(data.products.edges) ) {
    products = data.products.edges.map( ( { node }) => node)
  } else {
    products = []
  }
  
  const click = () => {

    console.log('click')
  
    const endCursor = data.products.pageInfo.endCursor;
  
    fetchMore({
    variables: { cursor: endCursor, name: router.query.name },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const newEdges = fetchMoreResult.products.edges;
      const pageInfo = fetchMoreResult.products.pageInfo;
  
      return newEdges.length ? {
        products: {
          __typename: previousResult.products.__typename,
          edges: [...previousResult.products.edges, ...newEdges],
          pageInfo,
        },
      }
      : previousResult
    }
  })
  
  }


  return (
    <ProductList loggedIn={props.loggedIn} products={ products } />
  )
}

const ProductList = (props) => {

  const router = useRouter();

  const { products } = props


  return (
    <>
    <Head>
     <title>Store</title>
     <link rel="icon" href="/orysha_template.jpg" />
    </Head>
    <Nav loggedIn={props.loggedIn} />
      <div class="flex-col">
        <div className="flex justify-center">
          <h1 class="text-6xl text-orange-600 font-mono font-bold leading-normal mt-0 mb-2 ">
            SHOP
          </h1>
        </div>
        <div className="flex justify-around" onClick={(event) => router.push(`/store?gender=${event.target.value}`)}>
          <button value="M" className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-2xl" >Gentlemen</button>
          <button value="F" className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-2xl">Ladies </button>
        </div>
      </div>
      <div className="container rounded bg-orange-300 mx-auto my-12 p-12">
        <div className="flex flex-col items-center">
        <input onChange={(event) => router.push(`/store?name=${event.target.value}`)}  class="w-full h-16 px-3 rounded mb-8 focus:outline-none focus:shadow-outline text-xl px-8 shadow-lg" type="search" placeholder="Search Product" />
          {  products.map(( { id, name, description, price, size, image }) => (
            <ProductItem name={name} id={id} description={description} price={price} size={size} image={image} />))
          }
                
          </div>      
      </div>
    </>
  )
}

//correct query & resolver
//stripe elements - generates token, pass token to backend
//backend - stripe sdk, npm module, use token to create charges 

const ProductItem = props => {

  const apolloClient = useApolloClient()

  const [quantity, setQuantity] = useState('');


  const addItemToBasket = async (productId) => {

    const data = await apolloClient.mutate(
        {
          mutation: add_item_to_basket_mutation , variables: { productId }
        }
      )
  }

  return (

    <div className="py-6">
      <div className="flex max-w-2xl h-64 border-solid border-4 border-gray-600 bg-white rounded overflow-hidden shadow-lg">
        <div className="w-1/3 p-8">
          <img class="w-full object-cover" src={props.image}></img>
        </div>
        <div className="w-1/3 p-8">
            <h1 className="text-black font-mono font-bold text-2xl">{ props.name }</h1>
            <h1 className="text-black text-base">£{ props.price }</h1>
            <div className="flex justify-between mt-2">
              <h1 className="text-black font-bold text-xl">Quantity</h1>
                <select>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
            </div>
            <p className="mt-2 text-black text-sm">{ props.description }</p>
          <button onClick={() => addItemToBasket(props.id)} className="px-3 py-2 mt-8 bg-black text-yellow-600 text-xs font-bold uppercase rounded">Add to Cart</button>
        </div>
      </div>
    </div>

    )
};


   
export default ProductQuery;

