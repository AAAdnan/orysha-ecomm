import React, { useState, useEffect } from 'react';
import useInfiniteScroll from "../components/InfiniteScroll";
import useProducts from '../components/GetProducts'
import { useQuery } from '@apollo/react-hooks';
import { gql, HttpLink } from 'apollo-boost';
import { NetworkStatus } from '@apollo/client';
import usePageBottom from '../utils/usePageBottom';


const GET_PRODUCTS = gql `
    query($pageSize: Int, $cursor: String) {
      products(pageSize: $pageSize, cursor: $cursor) {
        edges {
          node {
            name
            description
            price
            size
          }
        }
        pageInfo {
          endCursor
        }
      }
    }
`

const ProductQuery = () => {

const { data, error, loading, fetchMore } = useQuery(GET_PRODUCTS)

const isPageBottom = usePageBottom();

useEffect(() => {
  if (!isPageBottom || !data ) return;

  const endCursor = data.products.pageInfo.endCursor;

  fetchMore({
    variables: { cursor: endCursor },
    updateQuery: ( previousResult, { fetchMoreResult }) => {

      const newEdges = fetchMoreResult.products.edges;
      const pageInfo = fetchMoreResult.products.pageInfo;
  
      console.log(newEdges)

      console.log(endCursor)
  
  
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

  console.log('this is the bottom')

}, [isPageBottom, data, fetchMore])

let products;

if(data) {
  products = data.products.edges.map( ( { node }) => node)} 
else {
  products = []
}

return (
   <ProductList products={ products } 
   />
  )
}

const ProductList = ( { products }) => (
  <div>
    <h2>Product list</h2>
    {products.map(item => <li className="text-white">{ item.name }</li>)}
  </div>
)

export default ProductQuery;