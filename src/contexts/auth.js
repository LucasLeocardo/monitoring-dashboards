import { useState, createContext, useEffect } from 'react';
import Axios from '../api/axios';

export const AuthContext = createContext({});

function AuthProvider({children}) {
    const [user, setUser] = useState(true);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const API = Axios.getInstance(setUser);

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

    

    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, API}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;