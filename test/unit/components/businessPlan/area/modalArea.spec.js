import React from 'react';
import Immutable from 'immutable';
import ReduxFormField, { createFieldsFromArray } from "~/test/helpers/ReduxFormField.js";

import ComboBox from "../../../../../src/ui/comboBox/comboBoxComponent";
import RichText from "../../../../../src/components/richText/richTextComponent";
import DateTimePickerUi from "../../../../../src/ui/dateTimePicker/dateTimePickerComponent";
import ComboBoxFilter from "../../../../../src/ui/ComboBoxFilter/comboBoxFilter";
import Input from "../../../../../src/ui/input/inputComponent";
import { ModalArea } from "../../../../../src/components/businessPlan/area/modalArea";

const fields = createFieldsFromArray(["areaDes", "areaResponsable"]);

const selectsReducer = Immutable.Map({});
const consultDataSelect = () => { };
const getMasterDataFields = () => { };
const handleSubmit = () => { };
const consultListWithParameterUbication = () => { };

const defaultProps = { fields: fields, getMasterDataFields, handleSubmit, selectsReducer }

describe('Test BusinessPlan/modalArea', () => {
    it('should render Area', () => {
        const wrapper = shallow(<ModalArea {...defaultProps} />);
        expect(wrapper.find(Input).find({ name: 'areaDes' })).to.have.length(1);
    });
    it('should render Acciones necesarias', () => {
        const wrapper = shallow(<ModalArea {...defaultProps} />);
        expect(wrapper.find(RichText).find({ name: 'actionArea' })).to.have.length(1);
    });
    it('should render Responsable', () => {
        const wrapper = shallow(<ModalArea {...defaultProps} />);
        expect(wrapper.find(ComboBoxFilter).find({ name: 'areaResponsable' }));
    });
    it('should render Estado', () => {
        const wrapper = shallow(<ModalArea {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({ name: 'statusArea' }));
    });
    it('should render Fecha de solución', () => {
        const wrapper = shallow(<ModalArea {...defaultProps} />);
        expect(wrapper.find(DateTimePickerUi).find({ id: 'fecha' }));
    });
    
});