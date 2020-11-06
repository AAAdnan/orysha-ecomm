import '../styles.css';
import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { ApolloProvider } from '@apollo/client';
// import { AuthProvider } from '../components/AuthProvider'
import { setContext } from '@apollo/client/link/context';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Nav from '../components/Nav';

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/api/graphql',
  credentials: 'same-origin'
});

let token;

const authLink = setContext((_, { headers }) => {
  if (typeof window !=='undefined') {
      token = localStorage.getItem('authToken');
  }
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  fetchOptions: {
    credentials: "include"
  }
});

function MyApp({ Component, pageProps }) {
  return (
  <ApolloProvider client={client}>
    <div className="h-screen">
    <main className="flex-1">
      <Component {...pageProps} />
    </main>
    </div>
  </ApolloProvider>
  )
}

export default MyApp
