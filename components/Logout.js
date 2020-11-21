import { gql } from 'apollo-boost';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import Router from 'next/router';


const logout = () => {


    localStorage.removeItem('authToken');

    destroyCookie(null, 'token')

    Router.push('/product')

}

export default logout;
