import React from 'react';
import Immutable from 'immutable';

import ClientTypology from '~/src/components/contextClient/ClientTypology';
import Input from "~/src/ui/input/inputComponent";
import ComboBox from "~/src/ui/comboBox/comboBoxComponent";
import Textarea from "~/src/ui/textarea/textareaComponent";

import * as SelectActions from '~/src/components/selectsComponent/actions';

import InfoClientRedux, { InfoClient } from '~/src/components/clientEdit/components/InfoClient';

class ReduxFormField {
    constructor() {
        this.onChange = () => { };
        this.value = '';
    }
}

const clientInformacion = Immutable.Map({ 'responseClientInfo': {} });
const selectsReducer = Immutable.Map({'segment': [{id: 1, value: 'Constructor Pyme', key: 'Contructor Pyme'}, {id: 2, value: 'Otra cosa', key: 'Otra Cosa'}]});

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
    idTypeClient, idNumber, subSegment, description };

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

    it('should render Subsegmento when Segmento is Constructor Pyme', () => {
        const segmentPyme = clientInformacion.set('responseClientInfo',{segment: 1});
        const wrapper = shallow(<InfoClient {...defaultProps} clientInformacion={segmentPyme} 
            getMasterDataFields={() => null}
            consultListWithParameterUbication={() => new Promise((resolve, reject) => {})}
        />);
        
        expect(wrapper.state().isSegmentPymeConstruct).to.equal(true);
        expect(wrapper.find(ComboBox).find({name: 'subSegment'})).to.have.length(1);
    })

    it("shouldn't render Subsegmento when Segmento is not Constructor Pyme", () => {
        const segmentPyme = clientInformacion.set('responseClientInfo',{segment: 2});
        const wrapper = shallow(<InfoClient {...defaultProps} clientInformacion={segmentPyme} 
            getMasterDataFields={() => null}
            consultListWithParameterUbication={() => new Promise((resolve, reject) => {})}
        />);
        
        expect(wrapper.state().isSegmentPymeConstruct).to.equal(false);
        expect(wrapper.find(ComboBox).find({name: 'subSegment'})).to.have.length(0);
    })
});
