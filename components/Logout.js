import { gql } from 'apollo-boost';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import Router from 'next/router';


const logout = () => {

    console.log('loggedout')

    localStorage.removeItem('authToken');

    destroyCookie(null, 'token')

    Router.push('/')

}

export default logout;
