import React from 'react';
import { MainComponent } from '../../../../src/components/main/mainComponent';
import MainComponentRedux from '../../../../src/components/main/mainComponent';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let defaultProps;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('MainComponent Test', () => {
    beforeEach(() => {
        defaultProps = {
            dispatchRedirectUrl: sinon.fake(),
            mainReducer: Immutable.Map({ validToken: null })
        };

        store = mockStore({
            defaultProps
        });
    })

    it('Should render component with Redux', () => {
        itRenders(<MainComponentRedux {...defaultProps} store={store}/>);
    })

    it('Should render component', () => {
        itRenders(<MainComponent {...defaultProps}/>);
    })

    it('when componentDidUpdate is instanced', () => {
        const wrapper = shallow(<MainComponent {...defaultProps}/>);
        wrapper.instance().componentDidUpdate();
    })
})