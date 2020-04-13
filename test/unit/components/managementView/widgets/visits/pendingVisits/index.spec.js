import React from 'react';
import PendingVisitsRedux from '../../../../../../../src/components/managementView/widgets/visits/pendingVisits';
import { PendingVisits } from '../../../../../../../src/components/managementView/widgets/visits/pendingVisits';
import * as globalActions from '../../../../../../../src/components/globalComponents/actions';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import { SingleEntryPlugin } from 'webpack';


let dispatchRequestPendingVisits;
let dispatchChangeActiveItemMenu;
let dispatchConsultInfoClient;
let dispatchUpdateTitleNavBar;
let redirectUrl;

let defaultProps = {};

let store;
let middlewares = [thunk];
let mockStore = configureStore(middlewares);

describe('Unit test PendingVisits components', () => {
    
    beforeEach(() => {
        store = mockStore({
            pendingVisits : Immutable.Map({
                data : [],
                totalRecords : 0 
            })
        });
        dispatchRequestPendingVisits = sinon.fake();
        dispatchChangeActiveItemMenu = sinon.fake();
        dispatchUpdateTitleNavBar = sinon.fake();
        dispatchConsultInfoClient = sinon.fake();
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
        defaultProps = {
            dispatchRequestPendingVisits,
            dispatchChangeActiveItemMenu,
            dispatchConsultInfoClient,
            dispatchUpdateTitleNavBar,
            redirectUrl
        }
    })

    afterEach(() => {
        redirectUrl.restore();
    })

    it('Render component with redux', () => {
        itRenders(<PendingVisitsRedux store={store} {...defaultProps}/>)
    })

    it('Rendering test', () => {
        itRenders(<PendingVisits {...defaultProps}/>)
    })

    it('Test currentPage function', async () => {
        let page = 1 ;
        const wrapper = shallow(<PendingVisits {...defaultProps}/>)
        wrapper.setState({
            loading : false
        })
        wrapper.instance().currentPage(page)
        await expect(wrapper.state().loading).to.equal(true)
    })

    it('Test handelClickClient function, dispatchChangeActiveItemMenu called',  () => {
        const element = {
            idPrevisit: 5879069,
            clientName: "empanadas 152",
            typeOfMeeting: "Seguimiento",
            managerMeeting: "Alejandro Correa",
            visitTime: 1586439282851
        }
        const wrapper = shallow(<PendingVisits {...defaultProps}/>)
        wrapper.instance().handelClickClient(element);
        sinon.assert.calledOnce(dispatchChangeActiveItemMenu); 
        sinon.assert.calledOnce(dispatchConsultInfoClient);
    })
})

