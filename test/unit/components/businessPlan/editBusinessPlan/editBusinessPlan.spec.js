import React, { Component } from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import { reducer as formReducer } from "redux-form";
import * as globalActions from '~/src/components/globalComponents/actions';
import FormEdit from "~/src/components/businessPlan/editBusinessPlan/formEdit";
import EditBusinessPlan from '~/src/components/businessPlan/editBusinessPlan/editBusinessPlan';
import ReportsHeader from "../../../../../src/components/globalComponents/reportsHeader/component";

const clientInformacion = Immutable.Map({ 'responseClientInfo': "the_info" });
const reducerGlobal = Immutable.Map({'rowCount':{}});
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const defaultProps = { params: {id: 1} };

describe('Test BusinessPlan/editBusinessPlan/editBusinessPlan', () => {
    let store;
    let redirect;

    beforeEach(() => {
        store = mockStore({
            reducerGlobal,
            clientInformacion,
            form: formReducer
        });
        redirect = sinon.stub(globalActions, "redirectUrl");
    });

    afterEach(function() {
        redirect.restore();
    });

    it('should render ReportsHeader', () => {
        const wrapper = shallow(<EditBusinessPlan {...defaultProps} store={store} />).dive();
        expect(wrapper.find(ReportsHeader)).to.have.length(1);
    });

    it('should render FormEdit', () => {
        const wrapper = shallow(<EditBusinessPlan {...defaultProps} store={store} />).dive();
        expect(wrapper.find(FormEdit)).to.have.length(1);
    });
});