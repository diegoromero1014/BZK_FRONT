import React from 'react';
import { DownloadBusinessPlan } from '../../../../../src/components/businessPlan/downloadBusinessPlan/component';
import DownloadBusinessPlanRedux from '../../../../../src/components/businessPlan/downloadBusinessPlan/component';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let defaultProps;

let store;
let middlewares = [thunk];
let mockStore = configureStore(middlewares);

describe('DownloadBusinessPlan', () => {

    beforeEach(() => {
        defaultProps = {
        }

        store = mockStore({})
    })

    it('Should render component', () => {
        itRenders(<DownloadBusinessPlan {...defaultProps} />)
    })

    it('Should render component with redux', () => {
        itRenders(<DownloadBusinessPlanRedux {...defaultProps} store={store}/>)
    })
})