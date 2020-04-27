import React from 'react';
import { ButtonCreatePrevisit } from '../../../../../../../src/components/managementView/widgets/visits/economicGroupsToBeVisited/buttonCreatePrevisit';
import ButtonCreatePrevisitRedux from '../../../../../../../src/components/managementView/widgets/visits/economicGroupsToBeVisited/buttonCreatePrevisit';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import * as globalActions from '../../../../../../../src/components/globalComponents/actions';

let defaultProps;

let redirectUrl;
let dispatchChangeActiveItemMenu;
let dispatchConsultInfoClient;
let disptachUpdateTitleNavBar;
let dispatchUpdateTabSeleted; 

let store;
let middlewares = [thunk];
let mockStore = configureStore(middlewares);

describe("ButtonCreatePrevisit Test", () => {

    beforeEach(() => {
        redirectUrl = sinon.stub(globalActions, "redirectUrl"); 
        dispatchChangeActiveItemMenu = sinon.fake();
        dispatchConsultInfoClient = sinon.fake();
        disptachUpdateTitleNavBar = sinon.fake();
        dispatchUpdateTabSeleted = sinon.fake();
        defaultProps = {
            data: 1,
            dispatchChangeActiveItemMenu,
            dispatchConsultInfoClient,
            disptachUpdateTitleNavBar,
            dispatchUpdateTabSeleted
        };
        store = mockStore({ });
    })

    afterEach(() => {
        redirectUrl.restore();
    })

    it("Should render component", () => {
        itRenders(<ButtonCreatePrevisit {...defaultProps}/>)
    })

    it("Should render component with redux", () => {
        itRenders(<ButtonCreatePrevisitRedux {...defaultProps} store={store}/>)
    })

    it("When handleClick is instanced", async () => {
        const wrapper = shallow(<ButtonCreatePrevisit {...defaultProps} />);
        await wrapper.instance().handleClick(wrapper.props().data);
        sinon.assert.calledOnce(dispatchChangeActiveItemMenu);
        sinon.assert.calledOnce(dispatchConsultInfoClient);
        sinon.assert.calledOnce(dispatchUpdateTabSeleted);
    })

    it("When handleClick is instanced", async () => {
        const wrapper = shallow(<ButtonCreatePrevisit {...defaultProps} />);
        wrapper.find("button").simulate("click");
        sinon.assert.calledOnce(dispatchChangeActiveItemMenu);
        sinon.assert.calledOnce(dispatchConsultInfoClient);
        sinon.assert.calledOnce(dispatchUpdateTabSeleted);
    })
})