import React from 'react';
import Immutable from 'immutable';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ContactComponent from "../../../../src/components/contact/component";
import SelectFilterContact from '../../../../src/components/selectsComponent/selectFilterContact/selectFilterComponent';
import * as validatePermissionsByModuleActions from '../../../../src/actionsGlobal';
import * as globalActions from '../../../../src/components/globalComponents/actions';

const reducerGlobal = Immutable.Map({'rowCount':{}});
const contactsByClient = Immutable.Map({});
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test Contact/ContactComponent Filters', () => {
    let store;
    let stubFindServer;
    let stubRedirect;

    beforeEach(() => {
        store = mockStore({
            reducerGlobal,
            contactsByClient
        });
        const success = { payload: { data: { data: { module: "" } } } };
        stubFindServer = sinon.stub(validatePermissionsByModuleActions, 'validatePermissionsByModule').returns(() => {
            return new Promise(
                (resolve, reject) => resolve(success)
            )
        });
        stubRedirect = sinon.stub(globalActions, 'redirectUrl');
    });
    
    afterEach(function () {
        stubFindServer.restore();
        stubRedirect.restore();
    });

    it('should render filters: Función del contacto, Entidad/Línea de negocio, Tipo de contacto, Contactos desactualizados', () => {
        const wrapper = shallow(<ContactComponent store={store} />).dive();
        expect(wrapper.find(SelectFilterContact)).to.have.length(4);
    });
});