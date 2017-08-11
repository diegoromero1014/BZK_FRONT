import { UPDATE_ACTIVE_TAB_RISKS_MANAGMENT } from './constants';

export function updateTabSeletedRisksManagment(tabActive) {
    return {
        type: UPDATE_ACTIVE_TAB_RISKS_MANAGMENT,
        payload: tabActive
    }
}