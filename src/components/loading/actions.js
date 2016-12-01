/**
 * Created by ahurtado on 11/29/2016.
 */
import {SHOW_LOADING} from './reducer';

export function showLoading(show, textLoading){
    return {
        type: SHOW_LOADING,
        show,
        textLoading
    }
}