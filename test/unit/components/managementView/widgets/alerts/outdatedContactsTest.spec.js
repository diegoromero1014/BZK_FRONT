import React, { useCallback } from 'react';
import { OutdatedContactsComponent } from '../../../../../../src/components/managementView/widgets/alerts/outdatedContacts';
import OutdatedContactsComponentRedux from '../../../../../../src/components/managementView/widgets/alerts/outdatedContacts';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import * as globalActions from '../../../../../../src/components/globalComponents/actions';

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
            }
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

    it("When handleOnPageChange is instanced", () => {
        const wrapper = shallow(<OutdatedContactsComponent {...defaultProps} />);
        wrapper.instance().handleOnPageChange(1);
        sinon.assert.calledOnce(dispatchGetOutdatedContacts);
    })

    it("When handleOnClick is instanced", () => {
        const wrapper = shallow(<OutdatedContactsComponent {...defaultProps} />);
        wrapper.instance().handleOnClick(1);
        sinon.assert.calledOnce(redirectUrl);
        sinon.assert.calledOnce(dispatchChangeActiveItemMenu);
    })
})