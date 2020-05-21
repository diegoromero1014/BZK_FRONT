import React from 'react';
import { ManagementView } from '../../../../src/components/managementView';
import ManagementViewRedux from '../../../../src/components/managementView';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let defaultProps;
let dispatchUpdateTitleNavBar;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('ManagementView Test Component', () => {
    beforeEach(() => {
        dispatchUpdateTitleNavBar = sinon.fake();
        defaultProps = {
            dispatchUpdateTitleNavBar,
        };

        store = mockStore({
            defaultProps,
            filterDashboard : Immutable.Map({
                filterMode : "",
                criterio: "",
                id: "",
                title:""
            })
        })
    })

    it('Should render component with Redux', () => {
        itRenders(<ManagementViewRedux {...defaultProps} store={store}/>);
    })

    it('Should render component', () => {
        itRenders(<ManagementView {...defaultProps}/>);
    })
})