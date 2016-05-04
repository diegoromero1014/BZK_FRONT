import * as actions from './constants';
import axios from 'axios';
import {APP_URL} from '../../../constantsGlobal';

export function toggleModalShareholder(){
    return {
        type: actions.TOGGLE_MODAL_SHAREHOLDER
    };
}
