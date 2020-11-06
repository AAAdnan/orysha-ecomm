import { useQuery } from '@apollo/react-hooks';
import { gql, HttpLink } from 'apollo-boost'

const GET_PRODUCTS = gql `
    query($pageSize: Int, $cursor: String) {
      products(pageSize: $pageSize, cursor: $cursor) {
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

function useProducts() {

    const { data, loading, fetchMore } = useQuery(GET_PRODUCTS);
    
    if(loading || !data || !data.products) return { loading, products: [] }

    const loadMore = () => {
        return fetchMore({
            query: GET_PRODUCTS,
            notifyOnNetworkStatusChange: true,
            variables: {
                cursor: data.products.pageInfo.endCursor,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                const newEdges = fetchMoreResult.products.newEdges
                const pageInfo = fetchMoreResult.products.pageInfo
                
                return newEdges.length
                    ? {
                        persons: {
                            __typename: previousResult.products.__typename,
                            edges: [...previousResult.products.edges, ...newEdges],
                            pageInfo,
                        },
                    }
                    : previousResult
            },
        })
    }

    return {
        products: data.products.edges.map(({ node }) => node),
        loading,
        loadMore,
      }
}

export default useProducts;


