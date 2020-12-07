import { useState } from 'react';
import { useRouter } from 'next/router';
import { HttpLink } from 'apollo-boost';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { gql, useQuery } from '@apollo/client';
import ProductItemSingle from  '../../../components/ProductItemSingle';
import Nav from '../../../components/Nav';

export const getServerSideProps = async ctx => {

  const cookies = parseCookies(ctx)

  if(!cookies.token) return { props: { loggedIn: false } }

  if(cookies.token) return { props: { loggedIn: true } }
  
}


const ProductSinglePage = ( props ) => {

  const router = useRouter()

  const { query } = router

  const newQuery = parseInt(query.id);

  const GET_PRODUCTS = gql `
  query($pageSize: Int, $cursor: String, $name: String, $gender: String, $id: Int) {
    products(pageSize: $pageSize, cursor: $cursor, name: $name, gender: $gender, id: $id) {
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

const { data, error, loading, fetchMore } = useQuery(GET_PRODUCTS, { variables: { id: newQuery }} );

let product;

if(data && data.products && Array.isArray(data.products.edges) ) {
  product = data.products.edges.map( ( { node }) => node )[0]
} else {
  product = {}
}

    return(
        <>
          <Nav loggedIn={props.loggedIn}/>
          <div className="container rounded bg-orange-300 mx-auto my-12 p-12">
            <ProductItemSingle loggedIn={props.loggedIn} product={product} />
          </div>
        </>
    )
}


export default ProductSinglePage;