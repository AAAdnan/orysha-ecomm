import React, { useState } from 'react';
import useInfiniteScroll from "../components/InfiniteScroll";
import useProducts from '../components/GetProducts'
import { useQuery } from '@apollo/react-hooks';
import { gql, HttpLink } from 'apollo-boost';
import { NetworkStatus } from '@apollo/client';


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
          hasNextPage
        }
      }
    }
`



const List2 = () => {

const { data, error, loading, fetchMore } = useQuery(GET_PRODUCTS)


  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  let products, endCursor;


  if(data) {
    console.log(data)
    console.log(data.products)
    products = data.products.edges.map( ({ node }) => node)
    console.log(products)
    endCursor = data.products.pageInfo.endCursor
  }
  
  function loadMore() {
    fetchMore({
      query: GET_PRODUCTS,
      variables: { cursor: endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {

        const newEdges = fetchMoreResult.products.edges;
        const pageInfo = fetchMoreResult.products.pageInfo;
        
        return newEdges.length
          ? {
            products: {
              __typename: previousResult.products.__typename,
              edges: [...previousResult.products.edges, ...newEdges],
              pageInfo,
            },
          }
          : previousResult;
      },
    });
  };


  return (
    <>
      <ul className="list-group mb-2 text-white">
        {products.map(item => <li className="text-white">{ item.name }</li>)}
      </ul>
      {endCursor && 
        <button className="bg-orange-500 text-white" 
        onClick={loadMore()}
            >
            Load More
          </button>
      }
    </>
  )
};

export default List2;