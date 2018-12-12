import React from 'react';
import Immutable from 'immutable';

import Input from "~/src/ui/input/inputComponent";
import ComboBox from "~/src/ui/comboBox/comboBoxComponent";
import Textarea from "~/src/ui/textarea/textareaComponent";
import {ComponentStudyCredit} from "~/src/components/clients/creditStudy/componentCreditStudy";

import {ActividadEconomica} from "~/src/components/clientEdit/components/ActividadEconomica";

const clientInformacion = Immutable.Map({ 'responseClientInfo': {} });
const selectsReducer = Immutable.Map({});

const taxNature = {
    onChange: () => { },
    value: ''
}

const idCIIU = {
    onChange: () => { },
    value: ''
}

const idSubCIIU = {
    onChange: () => { },
    value: ''
}

const defaultProps = { clientInformacion, selectsReducer, taxNature, idCIIU, idSubCIIU };

describe('Test ClientEdit/ActividadEconomica', () => {
    it('should render Naturaleza tributaria', () => {
        const wrapper = shallow(<ActividadEconomica {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'idtaxNature'})).to.have.length(1);
    });

    it('should render CIIU', () => {
        const wrapper = shallow(<ActividadEconomica {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'idCIIU'})).to.have.length(1);
    });

    it('should render SubCIIU', () => {
        const wrapper = shallow(<ActividadEconomica {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'idSubCIIU'})).to.have.length(1);
    });
});

