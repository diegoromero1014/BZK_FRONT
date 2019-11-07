import React from 'react';
import Immutable from 'immutable';

import ClientTypology from '~/src/components/contextClient/clientTypology';
import Input from "~/src/ui/input/inputComponent";
import ComboBox from "~/src/ui/comboBox/comboBoxComponent";
import Textarea from "~/src/ui/textarea/textareaComponent";

import { InfoClient } from '~/src/components/clientEdit/components/InfoClient';

class ReduxFormField {
    constructor() {
        this.onChange = () => { };
        this.value = '';
    }
}

const clientInformacion = Immutable.Map({ 'responseClientInfo': {} });
const consultListByCatalogType = () => { };
const selectsReducer = Immutable.Map({'segment': [{id: 1, value: 'Constructor Pyme', key: 'Constructor Pyme'}, {id: 2, value: 'Otra cosa', key: 'Otra Cosa'}]});

const segment = {
    onChange: () => { },
    value: ''
}
const idTypeClient = {
    onChange: () => { },
    value: ''
}
const idNumber = {
    onChange: () => { },
    value: ''
}
const subSegment = {
    onChange: () => { },
    value: ''
}
const description = {
    onChange: () => { },
    value: ''
}

const defaultProps = { clientInformacion, selectsReducer, segment, 
    idTypeClient, idNumber, subSegment, description, consultListByCatalogType };

describe('Test ClientEdit/InfoClient', () => {
    it('should render ClientTypology', () => {
        const wrapper = shallow(<InfoClient {...defaultProps} />);
        expect(wrapper.find(ClientTypology)).to.have.length(1);
    });

    it('should render Razón social', () => {
        const wrapper = shallow(<InfoClient {...defaultProps} />);
        expect(wrapper.find(Input).find({name: 'razonSocial'})).to.have.length(1);
    });

    it('should render Tipo documento', () => {
        const wrapper = shallow(<InfoClient {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'tipoDocumento'})).to.have.length(1);
    });

    it('should render Numero documento', () => {
        const wrapper = shallow(<InfoClient {...defaultProps} />);
        expect(wrapper.find(Input).find({name: 'documento'})).to.have.length(1);
    });

    it('should render Segmento', () => {
        const wrapper = shallow(<InfoClient {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'segment'})).to.have.length(1);
    });

    it('should render Descripcion', () => {
        const wrapper = shallow(<InfoClient {...defaultProps} />);
        expect(wrapper.find(Textarea).find({name: 'description'})).to.have.length(1);
    });
});
