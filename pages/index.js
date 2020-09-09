import { gq, ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import ProductInfo  from "../components/Products/ProductInfo";


const Home = ({ data }) => {
  const client = new ApolloClient({
    uri: "http://localhost:3000/api/graphql-data",
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <div>
        <h1>NextJS GraphQL Apollo App</h1>
        <ProductInfo />
      </div>
    </ApolloProvider>
  );
};

export default Home;