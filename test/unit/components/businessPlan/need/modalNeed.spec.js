import React from 'react';
import Immutable from 'immutable';
import ReduxFormField, { createFieldsFromArray } from "~/test/helpers/ReduxFormField.js";

import ComboBox from "../../../../../src/ui/comboBox/comboBoxComponent";
import { ModalNeed } from "../../../../../src/components/businessPlan/need/modalNeed";
import RichText from "../../../../../src/components/richText/richTextComponent";
import DateTimePickerUi from "../../../../../src/ui/dateTimePicker/dateTimePickerComponent";
import ComboBoxFilter from "../../../../../src/ui/ComboBoxFilter/comboBoxFilter";

const fields = createFieldsFromArray(["needType", "descriptionNeed", "productFamily", "needProduct",
    "needImplementation", "needTask", "needBenefits", "needResponsable", "statusNeed"]);

const selectsReducer = Immutable.Map({});

const getClientNeeds = () => { };
const consultDataSelect = () => { };
const getMasterDataFields = () => { };
const handleSubmit = () => { };
const consultListWithParameterUbication = () => { };

const defaultProps = {
    fields: fields, getClientNeeds, consultDataSelect, consultListWithParameterUbication,
    getMasterDataFields, handleSubmit, selectsReducer
}

describe('Test BusinessPlan/modalNeed', () => {
    it('should render necesidad', () => {
        const wrapper = shallow(<ModalNeed {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({ name: 'needType' })).to.have.length(1);
    });
    it('should render Descripcion de la necesidad', () => {
        const wrapper = shallow(<ModalNeed {...defaultProps} />);
        expect(wrapper.find(RichText).find({ name: 'descriptionNeed' })).to.have.length(1);
    });
    it('should render familia de productos', () => {
        const wrapper = shallow(<ModalNeed {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({ name: 'productFamily' })).to.have.length(1);
    });
    it('should render productos necesidad', () => {
        const wrapper = shallow(<ModalNeed {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({ name: 'needProduct' })).to.have.length(1);
    });
    it('should render Implementacion', () => {
        const wrapper = shallow(<ModalNeed {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({ name: 'needImplementation' })).to.have.length(1);
    });
    it('should render Plan de Acción', () => {
        const wrapper = shallow(<ModalNeed {...defaultProps} />);
        expect(wrapper.find(RichText).find({ name: 'needTask' })).to.have.length(1);
    });
    it('should render Resultados y/o Beneficios esperados', () => {
        const wrapper = shallow(<ModalNeed {...defaultProps}/>);
        expect(wrapper.find(RichText).find({ name: 'needBenefits' }));
    });
    it('should render Responsable', () => {
        const wrapper = shallow(<ModalNeed {...defaultProps}/>);
        expect(wrapper.find(ComboBoxFilter).find({ name: 'needResponsable' }));
    });
    it('should render Estado', () => {
        const wrapper = shallow(<ModalNeed {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({ name: 'statusNeed' })).to.have.length(1);
    });
    it('should render Fecha de solución', () => {
        const wrapper = shallow(<ModalNeed {...defaultProps} />);
        expect(wrapper.find(DateTimePickerUi).find({ id: 'fecha' })).to.have.length(1);
    });
});