import React from "react";
import Link from "next/link";
import { setContext } from '@apollo/client/link/context';
import { parseCookies, setCookie, destroyCookie } from 'nookies'


setContext((_, { headers }) => {
  return {
   headers: {
      ...headers,
      Authorization: inMemoryToken ? `Bearer ${inMemoryToken}` : "",
    }
  }
});

const NavItem = props => (
  <li>
    <a href={props.href}
       className="text-sm font-bold text-white px-2 py-1 hover:bg-white hover:text-black rounded transition-colors duration-300"
    >
      {props.text}
    </a>
  </li>
);

const Nav = (props) => {
   return  ( 
    <nav className="flex justify-between p-4">
      <div className="flex items-center">
      <div className="inline-block h-6 w-6 rounded-full bg-gray-400" />
      <span className="m1-2 text-orange-600">Orysha</span>
      </div>
      <ul className="flex space-x-2">
        <NavItem text="Home" href="/" />
        {
          !props.loggedIn && <NavItem text="Login" href="/login" />
        
        }
        {
          !props.loggedIn && <NavItem text="Sign Up" href="/signup" />
        
        }
        <NavItem text="Product" href="/product"/>
        <NavItem text="Store" href="/store"/>
      </ul>
   </nav>
   )
 }
 

export default Nav;