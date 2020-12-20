import { gql } from 'apollo-boost';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import Router from 'next/router';


const logout = () => {

    console.log('loggedout')

    localStorage.removeItem('authToken');

    localStorage.removeItem('guest_id')

    destroyCookie({}, 'token')

    Router.push('/')

}

export default logout;
