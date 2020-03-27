import React from 'react';
import CovenantsAlertsRedux from '../../../../../../src/components/managementView/widgets/alerts/covenantsAlerts';
import {CovenantsAlertsComponent } from '../../../../../../src/components/managementView/widgets/alerts/covenantsAlerts';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let defaultProps;
let dispatchCovenantsAlerts;

let store;
const middleWares = [thunk];
const mockStore = configureStore(middleWares);

describe('CovenantAlert Test', () => {
    
    beforeEach(() => {
        dispatchCovenantsAlerts = sinon.stub().resolves({});
        defaultProps = {
            dispatchCovenantsAlerts,
        }
        store = mockStore({
            alertCovenant: Immutable.Map({ 
                responseCovenants: null, 
                totalCovenantsByFiltered: null
            })
        });
    })

    it('Should render component with Redux', () => {
        itRenders(<CovenantsAlertsRedux {...defaultProps} store={store} />);
    })

    it('Should render component', () => {
        itRenders(<CovenantsAlertsComponent {...defaultProps}/>);
    })

    it('When handleOnPageChange is instanced', async () => {
        const wrapper = shallow(<CovenantsAlertsComponent {...defaultProps} />);
        wrapper.setState({ loading: null });
        await wrapper.instance().handleOnPageChange(1);
        expect(wrapper.state().loading).to.equal(false);
        sinon.assert.calledOnce(dispatchCovenantsAlerts);
    })

    it('When handleOnClick and handleOnCloseModal is instanced', () => {
        const wrapper = shallow(<CovenantsAlertsComponent {...defaultProps} />);
        wrapper.setState({ open: false, idCovenant: null })
        const anyId = 1;
        wrapper.instance().handleOnClick({ idCovenant: anyId });
        expect(wrapper.state().open).to.equal(true);
        expect(wrapper.state().idCovenant).to.equal(anyId);

        wrapper.instance().handleOnCloseModal();
        expect(wrapper.state().open).to.equal(false);
        expect(wrapper.state().idCovenant).to.equal(null);
    })
})