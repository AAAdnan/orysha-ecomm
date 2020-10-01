import Layout from "../components/Layout";
import { gql, HttpLink } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks';

const GET_PRODUCTS = gql`
    query{
        products{
            name
        }
    }
`

const Store = props => {

    const { data, error, loading } = useQuery(GET_PRODUCTS);

    console.log(data)

    return( 
       <p>store</p>

    )

};

export default Store;