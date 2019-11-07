import React from 'react';
import Immutable from 'immutable';

import Input from "~/src/ui/input/inputComponent";
import ComboBox from "~/src/ui/comboBox/comboBoxComponent";
import Textarea from "~/src/ui/textarea/textareaComponent";

import { FormCreateProspect } from '~/src/components/propspect/formCreateProspect';
import {createFieldsFromArray} from "~/test/helpers/ReduxFormField.js";

const clientInformacion = Immutable.Map({ 'responseClientInfo': {} });
const consultList = () => { };
const consultDataSelect = () => { };
const handleSubmit = () => { };
const getMasterDataFields = () => new Promise((resolve, reject) => {});
const consultListByCatalogType = () => new Promise((resolve, reject) => resolve({payload: {data:{data:{id: 123, value: 'Grande', key: 'Grande', field: 'subSegment', description: ''}}}}));
const selectsReducer = Immutable.Map({'segment': [{id: 1, value: 'Constructor Pyme', key: 'Constructor Pyme'}, {id: 2, value: 'Otra cosa', key: 'Otra Cosa'}]});

const fields = createFieldsFromArray(["segment", "subSegment", "razonSocial", "idCIIU", "idSubCIIU", "country", "province"]);

const defaultProps = { fields:fields, clientInformacion, selectsReducer,
    handleSubmit,consultListByCatalogType,
    getMasterDataFields, consultList, consultDataSelect };

describe('Test createProspect/onChangeFields', () => {

    it('should refresh subSegment lists when segment changes', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
    
        wrapper.instance()._changeSegment(123);
        console.log(wrapper)
        expect(wrapper.state().segment).to.equal("123");
    });
});

describe('Test createProspect', () => {
    
    it('should render segment', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'segment'})).to.have.length(1);
    });

    it('should render subsegment', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'subSegment'})).to.have.length(1);
    });

    it('should render razonSocial', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
        expect(wrapper.find(Input).find({name: 'razonSocial'})).to.have.length(1);
    });

    it('should render Célula', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'Célula'})).to.have.length(1);
    });

    it('should render description', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
        expect(wrapper.find(Textarea).find({name: 'description'})).to.have.length(1);
    });

    it('should render ciiu', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'ciiu'})).to.have.length(1);
    });

    it('should render subCiiu', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'subCiiu'})).to.have.length(1);
    });

    it('should render address', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
        expect(wrapper.find(Input).find({name: 'address'})).to.have.length(1);
    });

    it('should render country', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'country'})).to.have.length(1);
    });

    it('should render province', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'province'})).to.have.length(1);
    });

    it('should render city', () => {
        const wrapper = shallow(<FormCreateProspect {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'city'})).to.have.length(1);
    });
});
