import React from 'react';
import {ModalTask} from '../../../../../src/components/visit/tasks/modalTask';
import * as actionsGlobal from  '../../../../../src/actionsGlobal';
import sinon from "sinon";

describe('Test visit/modalTask', () =>{

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
            value: "", error: '', onChange: () => {
            }
        },
        "fecha": {
            value: "", error: '', onChange: () => {
            }
        }
    };
    let defaultProps;
    let handleSubmit;
    let stubCreatedElement;
    let editTask;
    let swtShowMessage;
    let addTask;
    let isOpen;
    let resetForm;
    let filterUsersBancoDispatch;
    beforeEach(() => {

        handleSubmit = sinon.fake();
        editTask = sinon.fake();
        swtShowMessage = sinon.fake();
        addTask = sinon.fake();
        isOpen = sinon.fake();
        resetForm = sinon.fake();
        filterUsersBancoDispatch = sinon.stub();
        filterUsersBancoDispatch.resolves("");
        stubCreatedElement = sinon.stub(actionsGlobal, 'htmlToText');


        defaultProps = {
            fields: fields,
            handleSubmit,
            editTask,
            swtShowMessage,
            addTask,
            isOpen,
            resetForm,
            filterUsersBancoDispatch
        };
    });

    afterEach(function() {
        // runs after each test in this block
        stubCreatedElement.restore();
    });

    it('should render component modal task in visit', ()=>{
        const wrapper = shallow(<ModalTask {...defaultProps}/>);
        expect(wrapper.find("span").find({id:'asignator'})).to.have.length(1);
    });

    it('should execute the function _updateValue', ()=>{
        const wrapper = shallow(<ModalTask {...defaultProps}/>);
        wrapper.instance()._updateValue();
    });

    it('should execute the function _closeCreate', ()=>{
        const wrapper = shallow(<ModalTask {...defaultProps}/>);
        wrapper.instance()._closeCreate();
    });

    it('should execute the function _closeCreate when taskEdit is defined', ()=>{
        let taskEdit = {};
        defaultProps.taskEdit = taskEdit;
        const wrapper = shallow(<ModalTask {...defaultProps}/>);
        wrapper.instance()._closeCreate();
    });

    it('should execute the function create Task when EditaTask is defined ', ()=>{
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

    });

    it('should execute the function create Task when EditaTask is undefined ', ()=>{
        let fields = {
            "responsable": {
                value: 'daniel', error: '', onChange: () => {
                }
            }, "id": {
                value: '', error: '', onChange: () => {
                }
            },
            "idEmployee": {
                value: '', error: '', onChange: () => {
                }
            }, "tarea": {
                value: "<p>Tarea asignada por heurrea mentira! fghdretgds</p>", error: '', onChange: () => {
                }
            },
            "fecha": {
                value: "30/10/1992", error: '', onChange: () => {
                }
            }
        };

        defaultProps.fields = fields;
        const wrapper = shallow(<ModalTask {...defaultProps}/>);
        wrapper.instance()._handleCreateTask();

    });

    it('should execute the function create Task when fecha is not valid ', ()=>{
        let fields = {
            "responsable": {
                value: 'daniel', error: '', onChange: () => {
                }
            }, "id": {
                value: '', error: '', onChange: () => {
                }
            },
            "idEmployee": {
                value: '', error: '', onChange: () => {
                }
            }, "tarea": {
                value: "<p>Tarea asignada por heurrea mentira! fghdretgds</p>", error: '', onChange: () => {
                }
            },
            "fecha": {
                value: "1992/30/10", error: '', onChange: () => {
                }
            }
        };

        defaultProps.fields = fields;
        const wrapper = shallow(<ModalTask {...defaultProps}/>);
        wrapper.instance()._handleCreateTask();

    });
});
