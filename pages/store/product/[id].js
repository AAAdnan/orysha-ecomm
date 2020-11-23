import { useState } from 'react';
import { useRouter } from 'next/router';
import { gql, HttpLink } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import ProductItemSingle from  '../../../components/ProductItemSingle';
import Nav from '../../../components/Nav';


const ProductSinglePage = ( props ) => {

  const router = useRouter()

  const { query } = router

  const newQuery = parseInt(query.id);


  const [quantity, setQuantity] = useState(1);

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
          <Nav />
          <div className="container rounded bg-orange-300 mx-auto my-12 p-12">
            <ProductItemSingle product={product} />
          </div>
        </>
    )
}


export default ProductSinglePage;