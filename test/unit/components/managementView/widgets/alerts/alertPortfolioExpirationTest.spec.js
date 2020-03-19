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
    defaultProps = {
        alertPortfolioExpiration: Immutable.Map({ responseClients: {} })
    }

    beforeEach(() => {
        store = mockStore({});
    })

    it('Should render component with Redux', () => {
        itRenders(<AlertPortfolioExpirationRedux {...defaultProps} store={store} />);
    })

    it('Should render component', () => {
        itRenders(<AlertPortfolioExpiration {...defaultProps}/>);
    })
})