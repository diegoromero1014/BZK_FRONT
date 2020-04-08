import React from 'react';
import { EconomicGroupsToBeVisited } from '../../../../../../../src/components/managementView/widgets/visits/economicGroupsToBeVisited';
import EconomicGroupsToBeVisitedRedux from '../../../../../../../src/components/managementView/widgets/visits/economicGroupsToBeVisited';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';

let defaultProps;
let dispatchGetEconomicGroupsToBeVisited;

let redirectUrl;

let store;
let middlewares = [thunk];
let mockStore = configureStore(middlewares);

describe("EconomicGroupsToBeVisited Test", () => {

    beforeEach(() => {
        dispatchGetEconomicGroupsToBeVisited = sinon.stub().resolves({});
        defaultProps = {
            data: [],
            total: null,
            dispatchGetEconomicGroupsToBeVisited
        }
        store = mockStore({
            economicGroupsToBeVisited: {
                rows: [],
                rowCount: 0
            }
        })
    })

    it("Should render component", () => {
        itRenders(<EconomicGroupsToBeVisited {...defaultProps}/>)
    })

    it("Should render component with redux", () => {
        itRenders(<EconomicGroupsToBeVisitedRedux {...defaultProps} store={store}/>)
    })

    it("When handleOnPageChange is instanced", async () => {
        const wrapper = shallow(<EconomicGroupsToBeVisited {...defaultProps} />);
        wrapper.setState({ loading: null });
        await wrapper.instance().handleOnPageChange(1);
        expect(wrapper.state().loading).to.equal(false);
    })
})