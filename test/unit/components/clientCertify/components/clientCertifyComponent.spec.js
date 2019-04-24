import React from 'react';
import Immutable from 'immutable';
import ReduxFormField, {createFieldsFromArray} from "~/test/helpers/ReduxFormField.js";
import { ClientCertify } from '../../../../../src/components/clientCertify/clientCertifyComponent';
import InfoCliente from '../../../../../src/components/clientCertify/components/InfoCliente';
import ActividadEconomica from '../../../../../src/components/clientCertify/components/ActividadEconomica';
import Ubicacion from '../../../../../src/components/clientCertify/components/Ubicacion';
import InfoFinanciera from '../../../../../src/components/clientCertify/components/InfoFinanciera';
import ComboBoxFilter from "../../../../../src/ui/comboBoxFilter/comboBoxFilter";
import ComboBox from "../../../../../src/ui/comboBox/comboBoxComponent";
import NotesClient from "../../../../../src/components/clientEdit/notes/notesClient";

const clientInformacion = Immutable.Map({ 'responseClientInfo': {id: 1} });
const selectsReducer = Immutable.Map({'segment': [{id: 1, value: 'Constructor Pyme', key: 'Contructor Pyme'}, {id: 2, value: 'Otra cosa', key: 'Otra Cosa'}]});

const notes = {
    onChange: () => { },
    value: ''
};

const swtShowMessage = {
    onChange: () => { },
    value: ''
};
const economicGroupsByKeyword = { 
    onChange: () => { },
    value: ''
};
const fields = createFieldsFromArray(["nitPrincipal", "economicGroupName", "justifyNoGeren", "necesitaLME", "justifyNoLME", "justifyExClient"]);

const getMasterDataFields = () => new Promise((resolve, reject) => {});
const setNotes = () => {};
const consultList = () => {};
const deleteNote = () => {};
const clearNotes = () => {};
const updateErrorsNotes = () => {};
const updateTitleNavBar = () => {};
const handleSubmit = () => {};
const tabReducer = {
    get: () => {}
};

const defaultProps = { clientInformacion, selectsReducer, notes, updateErrorsNotes, updateTitleNavBar, getMasterDataFields, consultList, handleSubmit,
    setNotes, tabReducer, swtShowMessage, economicGroupsByKeyword, deleteNote, clearNotes, tabReducer, fields};

describe('Test ClientCertify', () => {
    it('should render InfoCliente', () => {              
        const wrapper = shallow(<ClientCertify {...defaultProps} />);
        expect(wrapper.find(InfoCliente)).to.have.length(1);
    });
    it('should render ActividadEconomica', () => {
        const wrapper = shallow(<ClientCertify {...defaultProps} />);
        expect(wrapper.find(ActividadEconomica)).to.have.length(1);
    });
    it('should render Ubicacion', () => {
        const wrapper = shallow(<ClientCertify {...defaultProps} />);
        expect(wrapper.find(Ubicacion)).to.have.length(1);
    });
    it('should render InfoFinanciera', () => {
        const wrapper = shallow(<ClientCertify {...defaultProps} />);
        expect(wrapper.find(InfoFinanciera)).to.have.length(1);
    });
    it('should render economicGroup ComboBoxFilter', () => {
        const wrapper = shallow(<ClientCertify {...defaultProps} />);
        expect(wrapper.find(ComboBoxFilter).find({id: 'inputEconomicGroup'})).to.have.length(1);
    });
    it('should render marcGeren ComboBox', () => {
        const wrapper = shallow(<ClientCertify {...defaultProps} />);
        expect(wrapper.find(ComboBox).find({name: 'marcGeren'})).to.have.length(1);
    });
    it('should render NotesClient', () => {
        const wrapper = shallow(<ClientCertify {...defaultProps} />);
        expect(wrapper.find(NotesClient)).to.have.length(1);
    });
    it('should render btnGuardar', () => {
        const wrapper = shallow(<ClientCertify {...defaultProps} />);
        expect(wrapper.find('button').find({id: 'btnGuardar'})).to.have.length(1);
    });
    it('should render btnCancelar', () => {
        const wrapper = shallow(<ClientCertify {...defaultProps} />);
        expect(wrapper.find('button').find({id: 'btnCancelar'})).to.have.length(1);
    });
});