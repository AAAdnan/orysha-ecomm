import { gql } from 'apollo-boost';
import { parseCookies, setCookie, destroyCookie } from 'nookies'


const logout = () => {

    localStorage.removeItem("token");

    destroyCookie(null, 'token')

}

export default logout