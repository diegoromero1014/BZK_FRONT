import React from 'react';
import {ModalTask} from "../../../../../src/components/visit/tasks/modalTask";
import * as actionsGlobal from "../../../../../src/actionsGlobal";

let defaultProps = {};

let htmlToTextStub;

describe('Test ModalTask component', () => {

    beforeEach(() => {
        htmlToTextStub = sinon.stub(actionsGlobal, 'htmlToText');
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
            swtShowMessage: sinon.fake()
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
    });
});