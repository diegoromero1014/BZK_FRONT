import axios from 'axios';

import router from '../historyRouter'

export function setAuthorizationHeader(token) {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}` 
    }
}

export function setInterceptors() {
    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (401 === error.response.status) {
            localStorage.setItem("sessionTokenFront", "");
            router.push('/login')
        } else if (403 === error.response.status) {
            alert("Señor usuario, no tiene permisos para visualizar este modulo");
            router.push("/dashboard")
        } else {
            return Promise.reject(error);
        }
    });
}