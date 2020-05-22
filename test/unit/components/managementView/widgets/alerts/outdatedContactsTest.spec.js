import React from 'react';
import { OutdatedContactsComponent } from '../../../../../../src/components/managementView/widgets/alerts/outdatedContacts';
import OutdatedContactsComponentRedux from '../../../../../../src/components/managementView/widgets/alerts/outdatedContacts';
import Immutable from 'immutable';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import * as globalActions from '../../../../../../src/components/globalComponents/actions';
import { NAME_FILTER_CLIENTS, NAME_FILTER_RELATION } from '../../../../../../src/components/managementView/widgets/searchClient/constants';

let defaultProps;
let dispatchGetOutdatedContacts;
let dispatchChangeActiveItemMenu;

let redirectUrl;

let store;
let middlewares = [thunk];
let mockStore = configureStore(middlewares);

describe("OutdatedContactsComponent Test", () => {

    beforeEach(() => {
        dispatchGetOutdatedContacts = sinon.stub().resolves({})
        dispatchChangeActiveItemMenu = sinon.fake();
        defaultProps = {
            data: null,
            total: null,
            dispatchGetOutdatedContacts,
            dispatchChangeActiveItemMenu
        }
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
        store = mockStore({
            outdatedContacts: {
                rows: [],
                rowCount: 0
            },
            filterDashboard: Immutable.Map({
                filterMode: "",
                criterio: "",
                id: "",
                title: ""
            })
        })
    })

    afterEach(() => {
        redirectUrl.restore();
    })

    it("Should render component", () => {
        itRenders(<OutdatedContactsComponent {...defaultProps}/>)
    })

    it("Should render component with redux", () => {
        itRenders(<OutdatedContactsComponentRedux {...defaultProps} store={store}/>)
    })

    it("When handleOnPageChange is instanced", async () => {
        const wrapper = shallow(<OutdatedContactsComponent {...defaultProps} />);
        wrapper.setState({ loading: null });
        await wrapper.instance().handleOnPageChange(1);
        expect(wrapper.state().loading).to.equal(false);
    })

    it("When handleOnClick is instanced", () => {
        const wrapper = shallow(<OutdatedContactsComponent {...defaultProps} />);
        wrapper.instance().handleOnClick(1);
        sinon.assert.calledOnce(redirectUrl);
        sinon.assert.calledOnce(dispatchChangeActiveItemMenu);
    })

    it("When handleOnPageChange is instanced and filterType is NAME_FILTER_CLIENTS", async () => {
        defaultProps.filterType = NAME_FILTER_CLIENTS;
        const wrapper = shallow(<OutdatedContactsComponent {...defaultProps} />);
        wrapper.setState({ loading: null });
        await wrapper.instance().handleOnPageChange(1);
        sinon.assert.called(dispatchGetOutdatedContacts);
        expect(wrapper.state().loading).to.equal(false);
    })

    it("When handleOnPageChange is instanced and filterType is NAME_FILTER_RELATION ", async () => {
        defaultProps.filterType = NAME_FILTER_RELATION;
        const wrapper = shallow(<OutdatedContactsComponent {...defaultProps} />);
        wrapper.setState({ loading: null });
        await wrapper.instance().handleOnPageChange(1);
        sinon.assert.called(dispatchGetOutdatedContacts);
        expect(wrapper.state().loading).to.equal(false);
    })
})