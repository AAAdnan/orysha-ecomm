require('dotenv').config()
import { ApolloServer, gql, AuthenticationError } from "apollo-server-micro";
const jwt = require('jsonwebtoken');
const typeDefs = require('../../pages/api/schema');
const resolvers = require('../../pages/api/resolvers');
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { isBuffer } from 'util';
import { isEnumType } from 'graphql';
 
const getUser = (token) => {

  try{
    const tokenNew = token.replace('Bearer ', '')

    const user = jwt.verify(tokenNew, process.env.ACCESS_TOKEN_SECRET)

    console.log('this is the user', user)

    return { userId: user.userId, role:  user.role }
  }
  catch(e){
    console.log(e.stack)

    return null;
  }
 
}

const context = ({ req }) => {

  const token = req.headers.authorization || '';
  

  console.log(token)

  if(token) {

    const user = getUser(token);

    return { user }
  }
  else return {}

}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});


const handler = server.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;