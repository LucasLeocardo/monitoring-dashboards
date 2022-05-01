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
        response => {
            if (response.status === ResponseStatus.UNAUTHORIZED) {
                setUser(false);
            }
            return response;
        }
    );

    const setAccessToken = token => {
        instance.defaults.headers.common.Authorization = 'Bearer ' + (token);
    }

    const getInstance = url => {
        instance.defaults.baseURL = url;
        return instance;
    }

    return {
        getInstance: url => getInstance(url),
        setAccessToken: token => setAccessToken(token)
    }
});
