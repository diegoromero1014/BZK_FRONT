import React from 'react';

import {ModalTask} from '../../../../../src/components/visit/tasks/modalTask';
import {createFieldsFromArray} from "../../../../helpers/ReduxFormField";

describe('Test visit/modalTask', () =>{

/*    let fields = {
        "responsable": {
            value: '', error: '', onChange: () => {
            }
        }, "id": {
            value: '', error: '', onChange: () => {
            }
        },
        "idEmployee": {
            value: '', error: '', onChange: () => {
            }
        }, "tarea": {
            value: <div><p></p></div>, error: '', onChange: () => {
            }
        },
        "fecha": {
            value: "30/10/1992", error: '', onChange: () => {
            }
        }
    };*/
    let fields = createFieldsFromArray(["responsable", "id", "idEmployee", "tarea","fecha"]);
    let defaultProps;
    let handleSubmit;
    let taskEdit;

    beforeEach(() => {

        handleSubmit = sinon.fake();

        defaultProps = {
            fields: fields,
            handleSubmit,
            taskEdit
        };
    });

    it('should render component modal task in visit', ()=>{
        const wrapper = shallow(<ModalTask {...defaultProps}/>);
        expect(wrapper.find("span").find({id:'asignator'})).to.have.length(1);
    });

    it('should execute the function createTask', ()=>{
        let fields = {
            "responsable": {
                value: '', error: '', onChange: () => {
                }
            }, "id": {
                value: '', error: '', onChange: () => {
                }
            },
            "idEmployee": {
                value: '', error: '', onChange: () => {
                }
            }, "tarea": {
                value: <div><p></p></div>, error: '', onChange: () => {
                }
            },
            "fecha": {
                value: "30/10/1992", error: '', onChange: () => {
                }
            }
        };
        let taskEdit = {}
        defaultProps.fields = fields;
        defaultProps.taskEdit = taskEdit;
        const wrapper = shallow(<ModalTask {...defaultProps}/>);
        wrapper.instance()._handleCreateTask();

    })
});
