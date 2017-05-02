import { UPDATE_ACTIVE_TAB_RISKS_MANAGMENT } from './constants';
import axios from 'axios';

export function updateTabSeletedRisksManagment(tabActive) {
    return {
        type: UPDATE_ACTIVE_TAB_RISKS_MANAGMENT,
        payload: tabActive
    }
}