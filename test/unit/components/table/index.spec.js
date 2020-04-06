import React from 'react';
import TableComponent from '../../../../src/components/table';
import { DEFAULT_NO_ROW_MESSAGE } from '../../../../src/components/table/constants'
import { noop } from 'lodash';

let Component;
let handleSort ;
let defaultProps;
let tableSettings = {
    data : [],
    columns : [],
    message : DEFAULT_NO_ROW_MESSAGE,
    onClick : noop,
    totalRecords : 0,
    recordsPerPage : 10,
    onPageChange : noop,
    propsComponent : {},
    Component,
    onSort : noop
}

describe('Tests tableComponent', () => {

    beforeEach(() => {
        handleSort = sinon.fake();
        
        defaultProps = {
            tableSettings : tableSettings,
            handleSort
        }
    })

    describe('Tests rendering', () => {

        it('Render TableComponent', () => {
            itRenders(<TableComponent {...defaultProps} /> )
        })
    })
})
