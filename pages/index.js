import { gql, ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import ProductInfo  from "../components/Products/ProductInfo";
import Form  from "../components/Products/Form";
import PrivateArea from './PrivateArea'

const httpLink = createHttpLink({ uri: 'http://localhost:3000/api/graphql-data' })

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token')

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  }
})


const Home = ({ data }) => {
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  })

  if(Cookies.get('signin')){
    router.push('/private-area')
  }
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>NextJS GraphQL Apollo App</h1>
        <Form path="/"/>
        <ProductInfo />
        <PrivateArea path="/private-area" />
      </div>
    </ApolloProvider>
  );
};

export default Home;