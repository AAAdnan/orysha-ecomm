import React, { useState } from "react";
import Link from "next/link";
import { setContext } from '@apollo/client/link/context';
import dynamic from 'next/dynamic'
import { parseCookies, setCookie, destroyCookie } from 'nookies'

// const logout = dynamic(import("../components/Logout"));
import logout from '../components/Logout';

setContext((_, { headers }) => {
  return {
   headers: {
      ...headers,
      Authorization: inMemoryToken ? `Bearer ${inMemoryToken}` : "",
    }
  }
});


const Nav = (props, {fixed }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-black mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a
              className="m1-2 text-orange-600 font-mono font-bold"
              href="/"
            >
             ORYSHA
            </a>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                <Link className="text-white" href="/store">store</Link>
                <NavItem text="HOME" href="/" font="fas fa-home text-lg leading-lg text-white opacity-75"/>
                { !props.loggedIn && <NavItem text="LOGIN" href="/login" font="fa fa-id-badge leading-lg text-white opacity-75"/> } 
                { !props.loggedIn && <NavItem text="REGISTER" href="/signup" font="fa fa-id-badge leading-lg text-white opacity-75"/> }
                <NavItem text="PRODUCT" href="/product " font="fab fa-product-hunt text-lg leading-lg text-white opacity-75"/>
                <NavItem text="STORE" href="/store " font="fas fa-store text-lg leading-lg text-white opacity-75"/>
                <NavItem text="CART" href="/cart " font="fas fa-shopping-cart text-lg leading-lg text-white opacity-75"/>
                { props.loggedIn && <NavItem text="SIGN OUT" href="/" onClick={() => logout} font="fas fa-door-open text-lg leading-lg text-white opacity-75"/> }
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}


const NavItem = props => (
  <Link href={props.href}>
    <li>
      <a onClick={props.onClick}
        className="px-3 py-2 flex items-center cursor-pointer text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
      >
      <i className={props.font}></i><span className="ml-2 text-white">{props.text}</span>
      </a>
    </li>
  </Link>
);

 

export default Nav;