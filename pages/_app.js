import '../styles.css';
import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { ApolloProvider } from '@apollo/client';
// import { AuthProvider } from '../components/AuthProvider'
import { setContext } from '@apollo/client/link/context';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import cookieCutter from 'cookie-cutter'
import { persistCache } from 'apollo-cache-persist';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

const httpLink = new HttpLink({
  uri: 'api/graphql',
});

let token, guestId;
 
const authLink = setContext((_, { headers }) => {
  if (typeof window !=='undefined') {
      token = cookieCutter.get('token');
      guestId = localStorage.getItem('guest_id');
  }
  return {
    headers: {
      ...headers,

      Authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
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
