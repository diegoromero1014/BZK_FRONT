import React from 'react';
import AlertPortfolioExpirationRedux from '../../../../../../src/components/managementView/widgets/alerts/alertPortfolioExpiration';
import {AlertPortfolioExpiration } from '../../../../../../src/components/managementView/widgets/alerts/alertPortfolioExpiration';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let defaultProps;

let store;
const middleWares = [thunk];
const mockStore = configureStore(middleWares);

describe('AlertPortfolioExpiration Test', () => {
    
    beforeEach(() => {
        defaultProps = {
            data: []
        }
        store = mockStore({
            alertPortfolioExpiration: Immutable.Map({ responseClients: {} }),
            filterDashboard : Immutable.Map({
                filterMode : "",
                criterio: "",
                id: "",
                title:""
            })
        });
    })

    it('Should render component with Redux', () => {
        itRenders(<AlertPortfolioExpirationRedux {...defaultProps} store={store} />);
    })

    it('Should render component', () => {
        itRenders(<AlertPortfolioExpiration {...defaultProps}/>);
    })
})