import React from 'react';
import {ModalComponentPendingTask}
    from "../../../../../src/components/pendingTask/createPendingTask/modalComponentPendingTask";
import Immutable from "immutable";


let filterUsersBanco;
const selectsReducer = Immutable.Map({});
const fields = {"responsable":  { value: '', error:'', onChange: () => {} }, "id": { onChange: () => {}},"fecha":{ onChange: () => {}}, "idEstado": {onChange: () => {}}, "tarea": {onChange: () => {}}, "advance": {onChange: () => {}}, "dateVisit":"", "idEmployee":{value:"val", onChange: () => {}}};
describe('Test pendingTask/modalComponentPendingTask', ()=>{

    let resetForm ;
    let defaultProps;
    let getMasterDataFields;
    let handleSubmit;


    beforeEach(() => {
        resetForm = sinon.fake();
        getMasterDataFields = sinon.fake();
        handleSubmit = sinon.fake();
        filterUsersBanco = sinon.stub();
        filterUsersBanco.resolves({
            payload: { data: { data: [{ title: 'a', cargo: 'a', empresa: 'a' }]}}
        });

        defaultProps = {
            fields: fields,
            resetForm,
            getMasterDataFields,
            filterUsersBanco,
            handleSubmit,
            selectsReducer

        }
    })
    it('sould render asginator', ()=>{
       const wrapper = shallow(<ModalComponentPendingTask {...defaultProps}/>);
       const instance = wrapper.instance();
       instance.props.fields.responsable.value = "heurrea";
       instance.props.fields.responsable.error = "error";
       expect(wrapper.find("span").find({id:'asignator'})).to.have.length(1);
    });
});