import React from 'react';
import Immutable from 'immutable';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Ubicacion} from "~/src/components/contact/contactDetail/ubicacion";
import { Checkbox } from "semantic-ui-react";
import { createFieldsFromArray } from "~/test/helpers/ReduxFormField.js";

const fields = createFieldsFromArray(["contactCountry", "contactProvince", "contactCity"]);
const selectsReducer = Immutable.Map({});

const defaultProps = {fields: fields, selectsReducer};
describe('Test Contact/ContactDetail/CheckUbicacion', () => {

    it('should render check: Cuando renderizo ubicacion', () => {
        const wrapper = shallow(<Ubicacion {...defaultProps} />);
        expect(wrapper.find(Checkbox)).to.have.length(1);
    });
});