import '../styles.css';
import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { ApolloProvider } from '@apollo/client';
// import { AuthProvider } from '../components/AuthProvider'
import { setContext } from '@apollo/client/link/context';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import cookieCutter from 'cookie-cutter'
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/api/graphql',
});

let token;
 
const authLink = setContext((_, { headers }) => {
  if (typeof window !=='undefined') {
      token = cookieCutter.get('token');
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
      <Footer />
    </main>
    
    </div>

  </ApolloProvider>
  )
}

export default MyApp
