import React from 'react';
import Immutable from 'immutable';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Modal from 'react-modal';

import ComboBox from '~/src/ui/comboBox/comboBoxComponent';
import ComboBoxFilter from '~/src/ui/comboBoxFilter/comboBoxFilter';
import Textarea from '~/src/ui/textarea/textareaComponent';
import DateTimePickerUi from '~/src/ui/dateTimePicker/dateTimePickerComponent';
import {ModalCreateTask} from '~/src/components/pendingTask/modalCreateTask';
import RichText from '~/src/components/richText/richTextComponent';
import * as actionsGlobal from "~/src/actionsGlobal";



const fields = {"responsable":  { value: '', error:'', onChange: () => {} }, "id": { onChange: () => {}},"fecha":{ onChange: () => {}}, "idEstado": {onChange: () => {}}, "tarea": {onChange: () => {}}, "advance": {onChange: () => {}}, "dateVisit":"", "idEmployee":{value:"val", onChange: () => {}}};
const selectsReducer = Immutable.Map({});
const myPendingsReducer = Immutable.Map({userName:null});
const reducerGlobal = Immutable.Map({});

const actionEdit = true;

const getMasterDataFields = () => { };
const handleSubmit = () => { };
const getInfoTaskUser = () => {};
const updateUserNameTask = () =>{};

const dataPromise = {payload: { data: { status: 200, validateLogin: true, data: {fieldName:"",message:""} } }};
const resolveData = () => {
    return new Promise(
        (resolve, reject) => resolve(dataPromise)
    )
}

const defaultProps = { fields: fields, selectsReducer, reducerGlobal, handleSubmit, myPendingsReducer, actionEdit, getInfoTaskUser, updateUserNameTask, getMasterDataFields };

describe('Test pendingTask/modalCreateTask', () => {

    it('should render DateTimePickerUi', () => {
        const wrapper = shallow(<ModalCreateTask {...defaultProps} createPendingTaskNew={resolveData} getInfoTaskUser={resolveData} />);
        expect(wrapper.find(DateTimePickerUi)).to.have.length(1);
    });

    it('should render ComboBox', () => {
        const wrapper = shallow(<ModalCreateTask {...defaultProps} createPendingTaskNew={resolveData} getInfoTaskUser={resolveData} />);
        expect(wrapper.find(ComboBox)).to.have.length(1);
    });
    it('should render ComboBoxFilter', () => {
        const wrapper = shallow(<ModalCreateTask {...defaultProps} createPendingTaskNew={resolveData} getInfoTaskUser={resolveData} />);
        expect(wrapper.find(ComboBoxFilter)).to.have.length(1);
    });
    it('should render RichText', () => {
        const wrapper = shallow(<ModalCreateTask {...defaultProps} createPendingTaskNew={resolveData} getInfoTaskUser={resolveData} />);
        expect(wrapper.find(RichText)).to.have.length(1);
    });
    it('should render Textarea', () => {
        const wrapper = shallow(<ModalCreateTask {...defaultProps} createPendingTaskNew={resolveData} getInfoTaskUser={resolveData} />);
        expect(wrapper.find(Textarea)).to.have.length(1);
    });
   
});