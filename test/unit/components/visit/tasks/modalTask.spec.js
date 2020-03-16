import React from 'react';
import {ModalTask} from "../../../../../src/components/visit/tasks/modalTask";
import * as actionsGlobal from "../../../../../src/actionsGlobal";

let defaultProps = {};

let htmlToTextStub;
let preventDefault;
let filterUsersBancoDispatch;
let consultclick;

describe('Test ModalTask component', () => {

    beforeEach(() => {
        preventDefault = sinon.fake();
        consultclick = sinon.fake();
        htmlToTextStub = sinon.stub(actionsGlobal, 'htmlToText');
        filterUsersBancoDispatch = sinon.stub();
        filterUsersBancoDispatch.resolves({
            payload: {
                data: {
                    data: [
                        {
                            id: 1,
                            title: 'Daniel Gallego'
                        },
                        {
                            id: 2,
                            title: 'Daniel Rodriguez'
                        }]
                }
            }
        });
        defaultProps = {
            fields: {
                id: {
                    value: 1123,
                    onChange: sinon.fake()
                },
                responsable: {
                    value: 'Daniel Gallego',
                    onChange: sinon.fake()
                },
                fecha: {
                    value: new Date(),
                    onChange: sinon.fake()
                },
                tarea: {
                    value: '<p>Tarea</p>',
                    onChange: sinon.fake()
                },
                idEmployee: {
                    value: 1232,
                    onChange: sinon.fake()
                }
            },
            commentsReducer: {
                comments: []
            },
            taskEdit: {

            },
            addTask: sinon.fake(),
            editTask: sinon.fake(),
            handleSubmit: sinon.fake(),
            dispatchGetCurrentComments: sinon.fake(),
            dispatchFillComments: sinon.fake(),
            swtShowMessage: sinon.fake(),
            filterUsersBancoDispatch
        };
    });

    afterEach(() => {
        htmlToTextStub.restore();
    });

    describe('Rendering tests', () => {

        it('should render ModalTask component', () => {
            itRenders(<ModalTask {...defaultProps}/>);
        });
    });

    describe('Actions tests', () => {

        it('_handleCreateTask should call addTask', () => {
            defaultProps.taskEdit = undefined;
            const wrapper = itRenders(<ModalTask {...defaultProps}/>);
            wrapper.instance()._handleCreateTask();
            expect(defaultProps.addTask.called).to.equal(true);
            expect(defaultProps.dispatchGetCurrentComments.called).to.equal(true);
            expect(defaultProps.swtShowMessage.called).to.equal(true);
        });

        it('_handleCreateTask should call editTask', () => {
            const wrapper = itRenders(<ModalTask {...defaultProps}/>);
            wrapper.instance()._handleCreateTask();
            expect(defaultProps.editTask.called).to.equal(true);
            expect(defaultProps.dispatchGetCurrentComments.called).to.equal(true);
            expect(defaultProps.dispatchFillComments.called).to.equal(true);
            expect(defaultProps.swtShowMessage.called).to.equal(true);
        });

        it('updateKeyValueUserBanco should call dispatchSwtShowMessage when employeeValue length is less than 3', () => {
            defaultProps.fields.responsable.value = 'Da';
            const wrapper = shallow(<ModalTask {...defaultProps}/>);
            wrapper.instance().updateKeyValueUsersBanco({ keyCode: 13, which: 13, preventDefault});
            expect(defaultProps.swtShowMessage.called).to.equals(true);
        });

        it('updateKeyValueUserBanco should not call preventDefault', () => {
            defaultProps.fields.responsable.value = 'Da';
            const wrapper = shallow(<ModalTask {...defaultProps}/>);
            wrapper.instance().updateKeyValueUsersBanco({ keyCode: 13, which: 13, consultclick});
            expect(preventDefault.called).to.equals(false);
        });

        it('updateKeyValueUserBanco should call dispatchFilterUserBanco when employeeValue length is greater than 3', () => {
            defaultProps.fields.responsable.value = 'Dani';
            const wrapper = shallow(<ModalTask {...defaultProps}/>);
            wrapper.instance().updateKeyValueUsersBanco({ keyCode: 13, which: 13, preventDefault});
            expect(defaultProps.swtShowMessage.called).to.equals(false);
            expect(filterUsersBancoDispatch.called).to.equals(true);
        });
    });
});