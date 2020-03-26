import axios from "axios";
import {APP_URL} from "../../constantsGlobal";
import {GET_ASSISTANTS_USER} from "./constants";

export function getUserAssistantsById() {
    const json = {
        messageHeader: {
            "sessionToken": window.localStorage.getItem('sessionTokenFront')
        },
        messageBody: null
    };

    return {
        type: GET_ASSISTANTS_USER,
        payload: axios.post(APP_URL + "/getUserAssistantsById", json)
    }
}