import { UPDATE_ACTIVE_TAB_PARTNERS } from './constants';

export function updateTabSeletedPartners(tabActive) {
    return {
        type: UPDATE_ACTIVE_TAB_PARTNERS,
        payload: tabActive
    }
}