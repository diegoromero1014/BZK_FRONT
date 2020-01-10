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

const getMasterDataFields = () => {};
const clientInformacion = Immutable.Map({ 'responseClientInfo': { segment: 1} });
const response = {payload: {data:{data:{id: 123, value: 'Grande', key: 'Grande', field: 'subSegment', description: ''}}}};
const selectsReducer = Immutable.Map({'segment': [{id: 1, value: 'Constructor Pyme', key: 'Constructor Pyme'}, {id: 2, value: 'Otra cosa', key: 'Otra Cosa'}]});

const segment = {
    onChange: () => { },
    value: 1
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
    value: 2
}
const description = {
    onChange: () => { },
    value: ''
}

describe('Test ClientEdit/InfoClient', () => {
    let deleteRiskGroup;
    let defaultProps;
    let consultListByCatalogType;
    beforeEach(() => {
        consultListByCatalogType = sinon.stub();
        consultListByCatalogType.resolves(response);
        defaultProps = {
            deleteRiskGroup,
            clientInformacion, selectsReducer, segment,
            idTypeClient, idNumber, subSegment, description, consultListByCatalogType, getMasterDataFields
        };
    });

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

    it('should not clear subSegment when segment did not change', () => {
        const wrapper = shallow(<InfoClient {...defaultProps} />);

        wrapper.instance()._changeCatalogSubsegment(segment, subSegment);
        expect(consultListByCatalogType.called).equal(true);
    });

    it('should clear subSegments when segment was changed', () => {
        const segment = {
            onChange: () => { },
            value: 3
        }
        const wrapper = shallow(<InfoClient segment={segment} {...defaultProps} />);

        wrapper.instance()._changeCatalogSubsegment(segment, subSegment);
        expect(consultListByCatalogType.called).equal(true);
    });
});
