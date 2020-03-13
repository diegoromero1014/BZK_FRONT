import React from 'react';
import { MainComponent } from '../../../../src/components/main/mainComponent';
import MainComponentRedux from '../../../../src/components/main/mainComponent';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let defaultProps;
let dispatchRedirectUrl;
let dispatchConsultParameterServer;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('MainComponent Test', () => {
    beforeEach(() => {
        dispatchRedirectUrl = sinon.fake();
        dispatchConsultParameterServer = sinon.stub().resolves({})
        defaultProps = {
            dispatchRedirectUrl,
            mainReducer: Immutable.Map({ validToken: null }),
            dispatchConsultParameterServer
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
    });

    it('when componentDidUpdate is instanced', () => {
        const wrapper = shallow(<MainComponent {...defaultProps}/>);
        wrapper.instance().componentDidUpdate();
        sinon.assert.calledTwice(dispatchRedirectUrl);
    })

    it('when componentDidUpdate is instanced and validToken is true', () => {
        defaultProps.mainReducer = Immutable.Map({ validToken: true })
        const wrapper = shallow(<MainComponent {...defaultProps}/>);
        wrapper.instance().componentDidUpdate();
        sinon.assert.calledOnce(dispatchRedirectUrl);
    })

    it('when startBlocking is instanced and resolve.payload is null', () => {
        const wrapper = shallow(<MainComponent {...defaultProps}/>);
        wrapper.instance().startBlocking();
        sinon.assert.calledOnce(dispatchConsultParameterServer);
    })

    it('when initializeRanges is instanced and data is null', () => {
        const wrapper = shallow(<MainComponent {...defaultProps}/>);
        wrapper.setState({ initialDate: null, finalDate: null })
        wrapper.instance().initializeRanges({ data: null });
        expect(wrapper.state().initialDate).to.equal(null);
        expect(wrapper.state().finalDate).to.equal(null);
    })

    it('when initializeRanges is instanced and data is not empty', () => {
        const wrapper = shallow(<MainComponent {...defaultProps}/>);
        wrapper.setState({ initialDate: null, finalDate: null })
        wrapper.instance().initializeRanges({ data: { value: ''}});
        expect(wrapper.state().initialDate).not.to.equal(null);
        expect(wrapper.state().finalDate).not.to.equal(null);
    })

})