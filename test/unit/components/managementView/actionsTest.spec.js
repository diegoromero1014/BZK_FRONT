import React from 'react';
import { 
    changeTabSeletedChartView,
    changeErrorYearSeleted,
    getCsv
} from '../../../../src/components/managementView/actions';
import {
    TAB_SELETED_ACTIVE,
    CHANGE_ERROR_YEAR,
    GET_CSV
} from '../../../../src/components/managementView/constants';

describe('ManagementView Test Actions', () => {

    it('changeTabSeletedChartView should return type TAB_SELETED_ACTIVE', () => {
        const response = changeTabSeletedChartView();
        expect(response.type).to.equal(TAB_SELETED_ACTIVE);
    })

    it('changeErrorYearSeleted should return type CHANGE_ERROR_YEAR', () => {
        const response = changeErrorYearSeleted();
        expect(response.type).to.equal(CHANGE_ERROR_YEAR);
    })

    it('getCsv should return type GET_CSV', () => {
        const response = getCsv();
        expect(response.type).to.equal(GET_CSV);
    })
})