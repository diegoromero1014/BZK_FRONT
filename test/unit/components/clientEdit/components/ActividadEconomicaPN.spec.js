import React from 'react';
import Immutable from 'immutable';

import Input from "~/src/ui/input/inputComponent";
import ComboBox from "~/src/ui/comboBox/comboBoxComponent";
import Textarea from "~/src/ui/textarea/textareaComponent";

import {ActividadEconomicaPN} from "~/src/components/clientEdit/components/ActividadEconomicaPN";
import ReduxFormField from "~/test/helpers/ReduxFormField.js"

const clientInformacion = Immutable.Map({ 'responseClientInfo': {'occupation': [{id: 1, field: 'occupation', value: 'Commerciante', key: 'Comerciante'}]} });
const selectsReducer = Immutable.Map({});


const occupation = new ReduxFormField('');

const idCIIU = new ReduxFormField('');

const idSubCIIU = new ReduxFormField('5');

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

    it("CIIU and SUBCIIU shouldn't be required when occupation is empty", () => {
        const wrapper = shallow(<ActividadEconomicaPN {...defaultProps} />);
        expect(wrapper.state().subciiuRequired).to.equal(false);
        expect(wrapper.state().ciiuRequired).to.equal(false);
    });

    it('CIIU and SUBCCIU should be required when occupation is Comerciante and form is Actualizar Cliente', () => {
        const wrapper = shallow(<ActividadEconomicaPN {...defaultProps} isMethodEditClient={false}/>);
        wrapper.instance()._onChangeOccupation(1,'Comerciante');
        expect(wrapper.state().ciiuRequired).to.equal(true);
        expect(wrapper.state().subciiuRequired).to.equal(true);
    });

    it("CIIU and SUBCCIU shouldn't be required when occupation is Comerciante and form is Editar Cliente", () => {
        const wrapper = shallow(<ActividadEconomicaPN {...defaultProps} isMethodEditClient={true}/>);
        wrapper.instance()._onChangeOccupation(1,'Comerciante');
        expect(wrapper.state().ciiuRequired).to.equal(false);
        expect(wrapper.state().subciiuRequired).to.equal(false);
    });

    it("should clear SUBCCIU when CIIU changes", () => {

        idSubCIIU.onChange("1");
        
        const wrapper = shallow(
            <ActividadEconomicaPN {...defaultProps} isMethodEditClient={true}
                consultListWithParameter={() => new Promise((resolve, reject) => {})}
            />);
        
        wrapper.instance()._onChangeCIIU(1);
        expect(idSubCIIU.value).to.equal('');
    
    });
});

