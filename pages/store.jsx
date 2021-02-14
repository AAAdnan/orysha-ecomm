import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { HttpLink } from 'apollo-boost'
import { useApolloClient, useQuery, gql } from '@apollo/client';
import Nav from '../components/Nav';
import ProductItem from '../components/ProductItem';
import Head from "next/head";
import { useRouter } from 'next/router'
import usePageBottom from '../utils/usePageBottom';

export const getServerSideProps = async ctx => {

  const cookies = parseCookies(ctx)

  console.log(cookies)

  if(!cookies.token) return { props: { loggedIn: false } }

  if(cookies.token) return { props: { loggedIn: true } }
  
}

const GET_PRODUCTS = gql `
    query($pageSize: Int, $cursor: String, $name: String, $gender: String) {
      products(pageSize: $pageSize, cursor: $cursor, name: $name, gender: $gender) {
        edges {
          node {
            id
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


const ProductQuery = (props) => {

  const isPageBottom = usePageBottom();

  const router = useRouter();

  const { data, error, loading, fetchMore } = useQuery(GET_PRODUCTS, { variables: { name: router.query.name, gender: router.query.gender }} );

  let products;

  if(data && data.products && Array.isArray(data.products.edges) ) {
    products = data.products.edges.map( ( { node }) => node)
  } else {
    products = []
  }

  useEffect(() => {
    if (!isPageBottom || !data ) return;

    console.log('this is the bottom')

    // fetchMore({
    //   variables: { cursor: endCursor, name: router.query.name },
    //   updateQuery: (previousResult, { fetchMoreResult }) => {
    //     const newEdges = fetchMoreResult.products.edges;
    //     const pageInfo = fetchMoreResult.products.pageInfo;
    
    //     return newEdges.length ? {
    //       products: {
    //         __typename: previousResult.products.__typename,
    //         edges: [...previousResult.products.edges, ...newEdges],
    //         pageInfo,
    //       },
    //     }
    //     : previousResult
    //   }
    // })
    
  }, [isPageBottom])

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
      <div className="flex-col">
        <div className="flex justify-center">
          <h1 className="text-6xl text-center font-bold text-white leading-normal mt-0 mb-2 ">
            SHOP
          </h1>
        </div>
        <div className="flex justify-around" onClick={(event) => router.push(`/store?gender=${event.target.value}`)}>
          <button value="M" className="bg-black text-orange-600 hover:bg-orange-600 hover:text-black font-bold py-2 px-4 rounded text-2xl" >M</button>
          <button value="F" className="bg-black text-orange-600 hover:bg-orange-600 hover:text-black font-bold py-2 px-4 rounded text-2xl">W </button>
        </div>
      </div>
      <div className="container rounded bg-orange-300 mx-auto my-12 p-12">
        <div className="flex flex-col items-center">
        <input onChange={(event) => router.push(`/store?name=${event.target.value}`)}  className="w-full h-16 px-3 rounded mb-8 focus:outline-none focus:shadow-outline text-xl px-8 shadow-lg" type="search" placeholder="Search Product" />
            {products.map(({ id, name, description, price, size, image}) => (
              <
              Link 
              href={{
                pathname: `/store/product/${id}`,
                query: { name: 'test'},
              }}              
              >
                <ProductItem key={id} name={name} id={id} price={price} size={size} image={image} name={name} />
              </Link>   
            ))}
          </div> 
      
      </div>
    </>
  )
}

export default ProductQuery;

