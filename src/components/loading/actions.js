import {SHOW_LOADING} from './reducer';

export function showLoading(show, textLoading){
    return {
        type: SHOW_LOADING,
        show,
        textLoading
    }
}