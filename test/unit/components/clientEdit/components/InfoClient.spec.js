import React from 'react';
import Immutable from 'immutable';

import ClientTypology from '~/src/components/contextClient/ClientTypology';
import Input from "~/src/ui/input/inputComponent";
import ComboBox from "~/src/ui/comboBox/comboBoxComponent";
import Textarea from "~/src/ui/textarea/textareaComponent";
import InfoClientRedux, { InfoClient } from '~/src/components/clientEdit/components/InfoClient';

import SelectActions from '~/src/components/selectsComponent/actions';

class ReduxFormField {
    constructor() {
        this.onChange = () => { };
        this.value = '';
    }
}

const clientInformacion = Immutable.Map({ 'responseClientInfo': {} });
const selectsReducer = Immutable.Map({'segment': [{id: 1, value: 'Constructor Pyme', key: 'Contructor Pyme'}]});

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

const defaultProps = { clientInformacion, selectsReducer, segment, idTypeClient, idNumber, subSegment, description };

describe('Test InfoClient', () => {
    it('should render ClientTypology', () => {
        const wrapper = shallow(<InfoClient {...defaultProps} />);
        expect(wrapper.find(ClientTypology)).to.have.length(1);
    });

    it('should render two input components', () => {
        const wrapper = shallow(<InfoClient {...defaultProps} />);
        expect(wrapper.find(Input)).to.have.length(2);

    });

    it('should render two ComboBox components', () => {
        const wrapper = shallow(<InfoClient {...defaultProps} />);
        expect(wrapper.find(ComboBox)).to.have.length(2);
    });

    it('should render one TextArea', () => {
        const wrapper = shallow(<InfoClient {...defaultProps} />);
        expect(wrapper.find(Textarea)).to.have.length(1);
    })
});

describe('Test Subsegment InfoClient', () => {
    
    before(() => {
        var getMasterDataFields = sinon.stub(SelectActions,'getMasterDataFields');
       
    });

    after(() => {
        getMasterDataFields.restore()
    });
    
    it('should render Subsegmento when Segmento is Constructor Pyme', () => {

        const segmentPyme = clientInformacion.set('responseClientInfo',{segment: 1});

        const wrapper = shallow(<InfoClient {...defaultProps} clientInformacion={segmentPyme} />);
        expect(wrapper.state().isSegmentPymeConstruct).to.equal(true);
    })
});