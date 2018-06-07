import React from 'react';
import Immutable from 'immutable';

import Input from "~/src/ui/input/inputComponent";
import ComboBox from "~/src/ui/comboBox/comboBoxComponent";
import Textarea from "~/src/ui/textarea/textareaComponent";

import {ActividadEconomicaPN} from "~/src/components/clientEdit/components/ActividadEconomicaPN";

const clientInformacion = Immutable.Map({ 'responseClientInfo': {} });
const selectsReducer = Immutable.Map({});

const occupation = {
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

const defaultProps = { clientInformacion, selectsReducer, occupation, idCIIU, idSubCIIU };

describe('Test ClientEdit/ActividadEconomica', () => {
    it('should render Ocupacion', () => {
        const wrapper = shallow(<ActividadEconomicaPN {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'occupation'})).to.have.length(1);
    });

    it('should render CIIU', () => {
        const wrapper = shallow(<ActividadEconomicaPN {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'idCIIU'})).to.have.length(1);
    });

    it('should render SubCIIU', () => {
        const wrapper = shallow(<ActividadEconomicaPN {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'idSubCIIU'})).to.have.length(1);
    });

    it("CIIU shouldn't be required when occupation is empty", () => {
        const wrapper = shallow(<ActividadEconomicaPN {...defaultProps} />);
        expect(wrapper.state())


    });
});

