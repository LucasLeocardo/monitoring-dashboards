import { useState, createContext, useEffect } from 'react';
import Axios from '../api/axios';
import * as Endpoints from '../entities/endPoints';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [selectedPage, setSelectedPage] = useState('');
    const axios = Axios(setUser);
    const API = axios.getInstance; 

    useEffect(() => {
        loadStorage();
        setLoadingAuth(false);
    }, []);

    function loadStorage() {
        const storageUser = localStorage.getItem('logged-user');
        if (storageUser && storageUser !== 'undefined') {
            setUser(JSON.parse(storageUser));
        } 
    }

    
    async function signIn(email, password) {
        toast.info('Logging in...');
        await API(Endpoints.BASE_ENDPOINT).post(Endpoints.USERS_LOGIN, {email: email, password: password})
            .then(response => {
                if (response.data) {
                    toast.success('Welcome to the platform!');
                    setUser(response.data);
                    localStorage.setItem('logged-user', JSON.stringify(response.data));
                }
            })
            .catch(error => ( error ));
    }

    async function signOut() {
        toast.info('Logging out...');
        await API(Endpoints.BASE_ENDPOINT, user.token).post(Endpoints.USERS_LOGOUT, { toke: user.token })
            .then( () => {
                setUser(null);
                localStorage.removeItem('logged-user');
                toast.success('Logout successfully!');
            })
            .catch(error => ( error ));
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, setUser, loading, API, signIn, signOut, selectedPage, setSelectedPage, loadingAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;