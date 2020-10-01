// import { getStaticApolloClient } from ''
// import { gql } from '@apollo/client'

// const GET_PRODUCTS = gql`
// query{
//     products{
//         name
//     }
// }
// `

// export async function getStaticProps() {
//     const client = await getStaticApolloClient()
//     await client.query({ query: GET_PRODUCTS })
//     return {
//         props: {
//             apolloStaticCache: client.cache.extract(),
//         }
//     }
// }