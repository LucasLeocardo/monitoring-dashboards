import { useState, createContext, useEffect } from 'react';
import Axios from '../api/axios';
import * as Endpoints from '../entities/endPoints';

export const AuthContext = createContext({});

function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const axios = Axios(setUser);
    const API = axios.getInstance(Endpoints.BASE_ENDPOINT);

    useEffect(() => {
        loadStorage();
    }, []);

    function loadStorage() {
        const storageUser = localStorage.getItem('logged-user');
        if (storageUser) {
            setUser(JSON.parse(storageUser));
        } 
        setLoading(false);
    }

    
    async function signIn(email, password) {
        await API.post(Endpoints.USERS_LOGIN, {email: email, password: password})
            .then(response => {
                axios.setAccessToken(response.headers.authorization);
                setUser(true);
            })
            .catch(error => ({ error }));
    }


    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, API, signIn}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;