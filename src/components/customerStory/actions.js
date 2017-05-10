import { UPDATE_ACTIVE_TAB_CS } from './constants';
import axios from 'axios';

export function updateTabSeletedCS(tabActive) {
    return {
        type: UPDATE_ACTIVE_TAB_CS,
        payload: tabActive
    }
}