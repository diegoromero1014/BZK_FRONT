import React from 'react';
import AlertPortfolioExpirationRedux from '../../../../../../src/components/managementView/widgets/alerts/alertPortfolioExpiration';
import {AlertPortfolioExpiration } from '../../../../../../src/components/managementView/widgets/alerts/alertPortfolioExpiration';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';
import * as globalActions from '../../../../../../src/components/globalComponents/actions';
import { NAME_FILTER_CLIENTS, NAME_FILTER_RELATION } from '../../../../../../src/components/managementView/widgets/searchClient/constants';

let defaultProps;
let dispatchGetAlertPortfolioExpirationDashboard;
let dispatchChangeActiveItemMenu;
let redirectUrl;

let store;
const middleWares = [thunk];
const mockStore = configureStore(middleWares);

describe('AlertPortfolioExpiration Test', () => {
    
    beforeEach(() => {
        dispatchGetAlertPortfolioExpirationDashboard = sinon.fake();
        dispatchChangeActiveItemMenu = sinon.fake();
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
        defaultProps = {
            data: [],
            dispatchGetAlertPortfolioExpirationDashboard,
            dispatchChangeActiveItemMenu
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

    afterEach(() => {
        redirectUrl.restore()
    })

    it('Should render component with Redux', () => {
        itRenders(<AlertPortfolioExpirationRedux {...defaultProps} store={store} />);
    })

    it('Should render component', () => {
        itRenders(<AlertPortfolioExpiration {...defaultProps}/>);
    })
    
    it("When handleOnPageChange is instanced", async () => {
        const wrapper = shallow(<AlertPortfolioExpiration {...defaultProps} />);
        wrapper.setState({ loading: null });
        await wrapper.instance().handleOnPageChange(1);
        expect(wrapper.state().loading).to.equal(false);
    })
    
    it("When setLoading is instanced", async () => {
        const wrapper = shallow(<AlertPortfolioExpiration {...defaultProps} />);
        wrapper.setState({ loading: null });
        await wrapper.instance().setLoading(true);
        expect(wrapper.state().loading).to.equal(true);
    })

    it("When redirectToAlertPortfolioExpiration is instanced", () => {
        const wrapper = shallow(<AlertPortfolioExpiration {...defaultProps} />);
        wrapper.setState({ loading: null });
        wrapper.instance().redirectToAlertPortfolioExpiration();
        sinon.assert.called(dispatchChangeActiveItemMenu);
    })
    
    it('When component did updated is instanced', () => { 
        const wrapper = shallow(<AlertPortfolioExpiration {...defaultProps} />);
        wrapper.setState({ loading: null });
        wrapper.setProps({ idFilter: 1 });
        expect(wrapper.state().loading).to.equal(true);
    })

    it("When handleOnPageChange is instanced and filterType is NAME_FILTER_CLIENTS", async () => {
        defaultProps.filterType = NAME_FILTER_CLIENTS;
        const wrapper = shallow(<AlertPortfolioExpiration {...defaultProps} />);
        wrapper.setState({ loading: null });
        await wrapper.instance().handleOnPageChange(1);
        sinon.assert.called(dispatchGetAlertPortfolioExpirationDashboard);
        expect(wrapper.state().loading).to.equal(false);
    })

    it("When handleOnPageChange is instanced and filterType is NAME_FILTER_RELATION ", async () => {
        defaultProps.filterType = NAME_FILTER_RELATION;
        const wrapper = shallow(<AlertPortfolioExpiration {...defaultProps} />);
        wrapper.setState({ loading: null });
        await wrapper.instance().handleOnPageChange(1);
        sinon.assert.called(dispatchGetAlertPortfolioExpirationDashboard);
        expect(wrapper.state().loading).to.equal(false);
    })

})