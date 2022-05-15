import axios from 'axios';
import * as ResponseStatus from '../entities/responseStatus';
import { toast } from 'react-toastify';

const axiosCreator = (setUser) => {

    const instance = axios.create({
        headers: {
            'Accept-Language': 'en-US'
        }
    });

    instance.interceptors.response.use(
        response => response,
        error => {
            if (error.response.status === ResponseStatus.UNAUTHORIZED) {
                toast.warning('Your session has expired, you are being logged out!');
                setUser(null);
                localStorage.removeItem('logged-user');
            } 
            else if (error.response.status === ResponseStatus.NOT_ACCEPTABLE) {
                toast.warning('Invalid email or password!');
            }
            else {
                toast.error('There was an error in the application!');
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

};

export default axiosCreator;
