import React from 'react';
import TaskFormComponentFormik, {TaskFormComponent} from "../../../../src/components/pendingTask/taskFormComponent";
import {Field} from "formik";

let defaultProps;
let onSubmit;
let taskData;
let setFieldValue;
let stateTask;
let values;
let commercialReportButtons;


describe('Test TaskFormComponent', () => {

    beforeEach(() => {
        onSubmit = sinon.fake();
        setFieldValue = sinon.fake();
        commercialReportButtons = sinon.fake();

        values = {
            employeeName: 'Daniel Gallego'
        };
        stateTask = [
            {
                id: 312312,
                title: 'Pendiente'
            },
            {
                id: 33122,
                title: 'En gestión'
            },
            {
                id: 353534,
                title: 'Cancelada'
            },
            {
                id: 3634562,
                title: 'Finalizada'
            },
        ]
        taskData = {
            finalDate: new Date(),
            idStatus: '165198',
            responsible: 'Daniel Gallego',
            task: 'Alguna tarea',
            advance: '',
            employeeName: 'Andrew Rayel'
        };
        defaultProps = {
            onSubmit,
            taskData,
            isEditable: true,
            setFieldValue,
            stateTask,
            values,
            commercialReportButtons
        };
    });


    describe('Test TaskFormComponent withFormik', () => {

        it('should render TaskFormComponent withFormik', () => {
            itRenders(<TaskFormComponentFormik {...defaultProps}/>);
        });

        it('should call handleSubmit Formik event', () => {
            const wrapper = shallow(<TaskFormComponentFormik/>);
            wrapper.props().handleSubmit(taskData, {props: defaultProps});
            sinon.assert.called(onSubmit);
        });

        it('should call validationSchema Formik event', () => {
            const wrapper = shallow(<TaskFormComponentFormik/>);
            const schemaShape = wrapper.props().validationSchema();
            assert.notEqual(schemaShape, null);
        });
    });

    describe('Test only TaskFormComponent', () => {

        it('should render TaskFormComponent class', () => {
            itRenders(<TaskFormComponent {...defaultProps}/>)
        });
    });

    describe('Test TaskFormComponent actions', () => {

        it('renderTitle should return a div with Formik field structure', () => {
            const wrapper = shallow(<TaskFormComponent {...defaultProps}/>);
            const result = wrapper.instance().renderTitle({
                name: 'Responsable',
                message: null,
                nullable: true
            });
            const resultWrapper = shallow(result);
            expect(resultWrapper.find('span').at(0).text()).to.equals('Responsable ');
        });

        it('renderTitle should return a div with Formik field structure when field is not nullable', () => {
            const wrapper = shallow(<TaskFormComponent {...defaultProps}/>);
            const result = wrapper.instance().renderTitle({
                name: 'Responsable',
                message: 'Valor correspondiente al responsable de la tarea',
                nullable: false
            });
            const resultWrapper = shallow(result);
            expect(resultWrapper.find('span').at(0).text()).to.equals('Responsable (');
        });

        it('onSelectEmployee should call setFieldValue twice', () => {
            const wrapper = shallow(<TaskFormComponent {...defaultProps}/>);
            wrapper.instance().onSelectEmployee({idUsuario: 31232, title: 'Daniel Gallego'});
            sinon.assert.calledTwice(setFieldValue);
        });

        it('onSelectEmployee should not call setFieldValue', () => {
            const wrapper = shallow(<TaskFormComponent {...defaultProps}/>);
            wrapper.instance().onSelectEmployee({});
            expect(setFieldValue.called).to.equals(false);
        });

        it('validateOnChangeEmployee should call setFieldValue', () => {
            const wrapper = shallow(<TaskFormComponent {...defaultProps}/>);
            wrapper.instance().validateOnChangeEmployee('Daniel Gallego');
            expect(setFieldValue.called).to.equals(true);
        });
    });

    describe('Test TaskFormComponent fields', () => {

        it('should render finalDate field', () => {
           const wrapper = shallow(<TaskFormComponent {...defaultProps}/>);
           expect(wrapper.find(Field).find({ name: 'finalDate' })).to.have.lengthOf(1);
        });

        it('should render idStatus field', () => {
            const wrapper = shallow(<TaskFormComponent {...defaultProps}/>);
            expect(wrapper.find(Field).find({ name: 'idStatus' })).to.have.lengthOf(1);
        });

        it('should render employeeName field', () => {
            const wrapper = shallow(<TaskFormComponent {...defaultProps}/>);
            expect(wrapper.find(Field).find({ name: 'employeeName' })).to.have.lengthOf(1);
        });

        it('should render task field', () => {
            const wrapper = shallow(<TaskFormComponent {...defaultProps}/>);
            expect(wrapper.find(Field).find({ name: 'task' })).to.have.lengthOf(1);
        });
    });
});
