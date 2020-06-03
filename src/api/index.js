import axios from 'axios';

import router from '../historyRouter'

export function setAuthorizationHeader(token) {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}` 
    }
}

export function successInterceptor(response) {
    return response;
}

export function errorInterceptor(historyRouter) {
    return function(error) {
        if (401 === error.response.status) {
            window.localStorage.setItem("sessionTokenFront", "");
            historyRouter.push('/login')
        } else if (403 === error.response.status) {
            historyRouter.push("/dashboard")
        } else {
            return Promise.reject(error);
        }
    }
}

export function setInterceptors() {
    axios.interceptors.response.use(successInterceptor, errorInterceptor(router));
}