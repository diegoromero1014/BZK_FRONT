import React from 'react';
import Immutable from 'immutable';

import Input from "~/src/ui/input/inputComponent";
import ComboBox from "~/src/ui/comboBox/comboBoxComponent";
import Textarea from "~/src/ui/textarea/textareaComponent";
import DateTimePickerUi from "~/src/ui/dateTimePicker/dateTimePickerComponent";

import {FormCreateTracking} from '~/src/components/risksManagement/covenants/createTracking/formCreateTracking';
import ReduxFormField from "~/test/helpers/ReduxFormField.js"

const validCovenant = new ReduxFormField('');
const selectsReducer = Immutable.Map({});

const defaultProps = { fields: {validCovenant}, selectsReducer, getMasterDataFields:() => null, handleSubmit:()=> null };

describe('Test Covenant/formCreateTracking', () => {
    it('should render Covenant vigente', () => {
        const wrapper = shallow(<FormCreateTracking {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'validCovenant'})).to.have.length(1);
    });
    it('should render Cumplimiento covenant', () => {
        const wrapper = shallow(<FormCreateTracking {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'fullfillmentCovenant'})).to.have.length(1);
    });
    it('should render Fecha de estados financieros', () => {
        const wrapper = shallow(<FormCreateTracking {...defaultProps} />);
        expect(wrapper.find(DateTimePickerUi).find({name: 'dateFinancialStatements'})).to.have.length(1);
    });
    it('should render Valor observado', () => {
        const wrapper = shallow(<FormCreateTracking {...defaultProps} />);
        expect(wrapper.find(Input).find({name: 'observedValue'})).to.have.length(1);
    });
    it('should render Observaciones', () => {
        const wrapper = shallow(<FormCreateTracking {...defaultProps} />);
        expect(wrapper.find(Textarea).find({name: 'observations'})).to.have.length(1);
    });        
});