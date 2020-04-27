import React from 'react';
import { VisitsSection } from '../../../../../../src/components/managementView/widgets/visits';
import VisitsSectionRedux from '../../../../../../src/components/managementView/widgets/visits';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let defaultProps;
let dispatchRequestPendingVisits;
let dispatchGetEconomicGroupsToBeVisited;

let store ;
const middlewares = [thunk] ;
const mockStore = configureStore(middlewares);
describe('VisitsSection Test', () => {

    beforeEach(() => {
        dispatchRequestPendingVisits = sinon.fake();
        dispatchGetEconomicGroupsToBeVisited = sinon.fake();
        defaultProps = {
            pendingVisits: { rowCount: null },
            dispatchRequestPendingVisits,
            dispatchGetEconomicGroupsToBeVisited,
        }
        store = mockStore({
            pendingVisits: { rowCount: null },
            economicGroupsToBeVisited: { rowCount: null }
         });
    })

    it('Should render component', () => {
        itRenders(<VisitsSection {...defaultProps} />)
    })
    
    it('Should render component with Redux', () => {
        itRenders(<VisitsSectionRedux {...defaultProps} store={store} />)
    })

    it('When handlePendingVisits is instanced', () => {
        const wrapper = shallow(<VisitsSection {...defaultProps} />);
        wrapper.instance().handlePendingVisits();
        sinon.assert.called(dispatchRequestPendingVisits);
    })

    it('When handleDispatchGetEconomicGroupsToBeVisited is instanced', () => {
        const wrapper = shallow(<VisitsSection {...defaultProps} />);
        wrapper.instance().handleDispatchGetEconomicGroupsToBeVisited();
        sinon.assert.called(dispatchGetEconomicGroupsToBeVisited);
    })
})