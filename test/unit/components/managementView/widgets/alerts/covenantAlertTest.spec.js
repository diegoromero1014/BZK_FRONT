import React from 'react';
import CovenantsAlertsRedux from '../../../../../../src/components/managementView/widgets/alerts/covenantsAlerts';
import {CovenantsAlertsComponent } from '../../../../../../src/components/managementView/widgets/alerts/covenantsAlerts';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let defaultProps;

let store;
const middleWares = [thunk];
const mockStore = configureStore(middleWares);

describe('CovenantAlert Test', () => {
    
    beforeEach(() => {
        defaultProps = {
            alertCovenant: Immutable.Map({ responseCovenants: {} })
        }
        store = mockStore({});
    })

    // it('Should render component with Redux', () => {
    //     itRenders(<CovenantsAlertsRedux {...defaultProps} store={store} />);
    // })

    it('Should render component', () => {
        itRenders(<CovenantsAlertsComponent {...defaultProps}/>);
    })
})