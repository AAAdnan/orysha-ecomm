import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const initialAuthState = {
        token: undefined,
        userId: undefined
    };

    const [ authState, setAuthState ] = useState(initialAuthState);

    useEffect(() => {
        if (localStorage.getItem('userId') !== authState.userId) {
          setAuthState({
            ...authState,
            userId: localStorage.getItem('userId'),
          });
        }
      }, [authState]);

    const signIn = (userId, token ) => {
        setAuthState({
            ...authState,
            userId,
            token
        });
        if (typeof window !== 'undefined'){
            localStorage.setItem('userId', userId);
        }
    }

const signOut = () => {
    setAuthState(initialAuthState);
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userId');
    }
}

};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };