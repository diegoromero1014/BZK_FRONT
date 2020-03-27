import React from 'react';
import AlertSectionRedux from '../../../../../../src/components/managementView/widgets/alerts';
import { AlertSection } from '../../../../../../src/components/managementView/widgets/alerts';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let defaultProps = {};

let store;
const middleWares = [thunk];
const mockStore = configureStore(middleWares);

describe('AlertSection Test', () => {
    beforeEach(() => {
        defaultProps = {
            alertPortfolioExpiration: Immutable.Map({ totalClientsByFiltered: null }),
            alertBlackList: Immutable.Map({ totalBlackListFiltered: null }),
        }
        
        const initialStore = {
            alertBlackList: Immutable.Map({ totalBlackListFiltered: null }),
            outdatedContacts: { rowCount: null },
            alertCovenant: Immutable.Map({totalCovenantsByFiltered : null })
        }

        store = mockStore(initialStore);
    })

    it('Should render component with Redux', () => {
        itRenders(<AlertSectionRedux {...defaultProps} store={store} />);
    })

    it('Should render component', () => {
        itRenders(<AlertSection {...defaultProps} />);
    })
})