import React from 'react';
import Immutable from "immutable";
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { ComponentClientInformation } from '../../../../src/components/clientInformation/componentClientInformation';
import NotificationComponent from '../../../../src/components/notification/notificationComponent';
import * as globalActions from '../../../../src/components/globalComponents/actions';

const clientInformacion = Immutable.Map({ 'responseClientInfo': {} });                
const dataPromise = {
    payload: { 
        data: { 
            status: 200, 
            validateLogin: true,
            data: { } 
        } 
    }
};
const validateExpiredPortfolio = () => {
    return new Promise((resolve) => resolve(dataPromise))
};           
const reducerGlobal = Immutable.Map({ permissionsClients: { 'Grupo de Riesgo' : ''} });
const defaultProps = { 
    tabReducer: Immutable.Map({ tabSelected: null }), 
    clientInformacion, 
    reducerGlobal, 
    validateExpiredPortfolio ,
    resetAccordion: sinon.fake(),
    updateTitleNavBar: sinon.fake(),
    showLoading: sinon.fake(),
    validatePermissionsByModule: sinon.stub().resolves({}),
    consultInfoClient: sinon.stub().resolves({}),
    viewAlertClient: sinon.fake(),
    updateTabSeletedCS: sinon.fake(),
}
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test clientInformation/componentClientInformation', () => {

    let store;
    let stubRedirect;

    beforeEach(() => {
        const selectsReducer = Immutable.Map({ });
        store = mockStore({ selectsReducer, reducerGlobal });
        stubRedirect = sinon.stub(globalActions, 'redirectUrl');
    });

    afterEach(function () { stubRedirect.restore() });

    it('should render NotificationComponent', () => {
        const state = { 
            allow_visor_cliente: false, 
            notification: { 
                open: true, 
                data: [{ entityName: 'Example entity', daysArrears: 23, overdueBalance: 500000 }]
            },
        };
        const wrapper = shallow(<ComponentClientInformation {...defaultProps} store={store} />);
        wrapper.setState(state);
        expect(wrapper.find(NotificationComponent)).to.have.length(1);
    });

    it('shouldn´t render NotificationComponent', () => {
        const state = { 
            allow_visor_cliente: false, 
            notification: { 
                open: false, 
                data: null
            },
        };
        const wrapper = shallow(<ComponentClientInformation {...defaultProps} store={store} />);
        wrapper.setState(state);
        expect(wrapper.find(NotificationComponent)).to.have.length(0);
    });
});