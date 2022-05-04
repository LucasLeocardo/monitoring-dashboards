import axios from 'axios';
import * as ResponseStatus from '../entities/responseStatus';

export default ((setUser) => {

    const instance = axios.create({
        headers: {
            'Accept-Language': 'en-US',
            'Access-Control-Allow-Origin': '*'
        }
    });

    instance.interceptors.response.use(
        response => response,
        error => {
            if (error.status === ResponseStatus.UNAUTHORIZED) {
                setUser(null);
                localStorage.removeItem('logged-user');
            }
            return error;
        }
    );

    const getInstance = (url, token) => {
        if (token) {
            instance.defaults.headers.common.Authorization = 'Bearer ' + (token);
        }
        instance.defaults.baseURL = url;
        return instance;
    }

    return {
        getInstance: (url, token = null) => getInstance(url, token)
    }

});
