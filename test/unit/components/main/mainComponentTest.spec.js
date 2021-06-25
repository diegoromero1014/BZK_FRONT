import React from 'react';
import { MainComponent } from '../../../../src/components/main/mainComponent';
import MainComponentRedux from '../../../../src/components/main/mainComponent';
import * as globalActions from '../../../../src/components/globalComponents/actions';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let defaultProps;
let redirectUrl;
let dispatchConsultParameterServer;
let dispatchChangeActiveMenu;
let dispatchDesactiveMenu;
let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('MainComponent Test', () => {
    beforeEach(() => {
        dispatchDesactiveMenu = sinon.fake();
        dispatchChangeActiveMenu = sinon.fake();
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
        dispatchConsultParameterServer = sinon.stub().resolves({})
        defaultProps = {
            redirectUrl,
            mainReducer: Immutable.Map({ validToken: null }),
            dispatchConsultParameterServer,
            dispatchChangeActiveMenu,
            dispatchDesactiveMenu
        };

        store = mockStore({
            defaultProps
        });
    })

    afterEach(() => {
        redirectUrl.restore();
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
        sinon.assert.calledTwice(redirectUrl);
    })

    it('when componentDidUpdate is instanced and validToken is true', () => {
        defaultProps.mainReducer = Immutable.Map({ validToken: true })
        const wrapper = shallow(<MainComponent {...defaultProps}/>);
        wrapper.instance().componentDidUpdate();
        sinon.assert.calledOnce(redirectUrl);
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
    it('When changesStatusMenuDes is instanced', () => {
        const wrapper = shallow(<MainComponent {...defaultProps}/>);
        wrapper.instance().changesStatusMenuDes();
        sinon.assert.calledOnce(dispatchChangeActiveMenu);
    });
    it('When changesStatusMenuAct is instanced', () => {
        const wrapper = shallow(<MainComponent {...defaultProps}/>);
        wrapper.instance().changesStatusMenuAct();
        sinon.assert.calledOnce(dispatchDesactiveMenu);
    });
})