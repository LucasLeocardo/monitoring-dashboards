import { useState, createContext, useEffect } from 'react';
import Axios from '../api/axios';
import * as Endpoints from '../entities/endPoints';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const axios = Axios(setUser);
    const API = axios.getInstance;

    useEffect(() => {
        loadStorage();
    }, []);

    function loadStorage() {
        const storageUser = localStorage.getItem('logged-user');
        if (storageUser && storageUser !== 'undefined') {
            setUser(JSON.parse(storageUser));
        } 
        setLoading(false);
    }

    
    async function signIn(email, password) {
        await API(Endpoints.BASE_ENDPOINT).post(Endpoints.USERS_LOGIN, {email: email, password: password})
            .then(response => {
                if (response.data) {
                    toast.success('Welcome to the platform!');
                    setUser(response.data);
                    localStorage.setItem('logged-user', JSON.stringify(response.data));
                }
                else {
                    toast.warning('Invalid email or password!');
                }
            })
            .catch(error => ( error ));
    }

    async function signOut() {
        await API(Endpoints.BASE_ENDPOINT, user.token).post(Endpoints.USERS_LOGOUT, { toke: user.token })
            .then( () => {
                setUser(null);
                localStorage.removeItem('logged-user');
                toast.success('Logout successfully!');
            })
            .catch(error => ( error ));
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, setUser, loading, API, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;