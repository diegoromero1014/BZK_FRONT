import React from 'react';
import Immutable from 'immutable';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { reducer as formReducer } from "redux-form";

import ComboBox from "~/src/ui/comboBox/comboBoxComponent";
import ContactsByFunctionOrType from "~/src/components/ContactByFunctionOrType/ContactByFunctionOrTypeComponent";
import * as contactByFunctionActions from "~/src/components/ContactByFunctionOrType/actions";
import * as globalActions from '~/src/components/globalComponents/actions';

const selectsReducer = Immutable.Map({});
const contactsByFunctionOrType = Immutable.Map({});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test Contact/ContactsByFunctionOrType Filters', () => {
    let store;
    let stubFindServer;
    let stubRedirect;

    beforeEach(() => {
        store = mockStore({
            form: formReducer,
            selectsReducer,
            contactsByFunctionOrType
        });
        const success = { payload: { data: { data: { idFunction: "contactFunction.value", idType:"contactType.value", idPosition:"contactPositionFilter.value", idDependency:"contactDependencyFilter.value", pageNum:1, maxRows:1, order:0, columnOrder:0 } } } };
        stubFindServer = sinon.stub(contactByFunctionActions, 'contactsByFunctionOrTypeFindServer').returns(() => {
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

    it('should render filter: Función del contacto', () => {
        const wrapper = shallow(<ContactsByFunctionOrType store={store} />).dive().dive().dive().dive();
        expect(wrapper.find(ComboBox).find({name: "contactFunction"})).to.have.length(1);
    });

    it('should render filter: Tipo de  contacto', () => {
        const wrapper = shallow(<ContactsByFunctionOrType store={store} />).dive().dive().dive().dive();
        expect(wrapper.find(ComboBox).find({name: "contactType"})).to.have.length(1);
    });

    it('should render filter: Cargo del contacto', () => {
        const wrapper = shallow(<ContactsByFunctionOrType store={store} />).dive().dive().dive().dive();
        expect(wrapper.find(ComboBox).find({name: "contactPositionFilter"})).to.have.length(1);
    });

    it('should render filter: Área del contacto', () => {
        const wrapper = shallow(<ContactsByFunctionOrType store={store} />).dive().dive().dive().dive();
        expect(wrapper.find(ComboBox).find({name: "contactDependencyFilter"})).to.have.length(1);
    });
});

