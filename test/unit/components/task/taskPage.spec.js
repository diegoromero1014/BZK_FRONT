import React from 'react';
import Immutable from 'immutable';
import * as globalActions from '../../../../src/components/globalComponents/actions';
import ReportsHeader from "../../../../src/components/globalComponents/reportsHeader/component";
import {EDITAR, REQUEST_ERROR, REQUEST_INVALID_INPUT, REQUEST_SUCCESS} from "../../../../src/constantsGlobal";
import TaskPageRedux, {TaskPage} from "../../../../src/components/pendingTask/taskPage";
import TaskFormComponent from "../../../../src/components/pendingTask/taskFormComponent";
import SweetAlert from "../../../../src/components/sweetalertFocus";
import {
    MESSAGE_TASK_CREATE_ERROR,
    MESSAGE_TASK_CREATE_SUCCESS,
    MESSAGE_TASK_EDIT_ERROR,
    MESSAGE_TASK_EDIT_SUCCESS,
    TITLE_TASK_CREATE,
    TITLE_TASK_EDIT
} from "../../../../src/components/pendingTask/constants";
import thunk from "redux-thunk";
import configureStore from 'redux-mock-store';

const validateEnter = true;

const taskStates = [
    {
        "id": 1,
        "field": "taskStatus",
        "value": "Cancelada",
        "parentId": null,
        "key": "Cancelada",
        "description": ""
    },
    {
        "id": 1,
        "field": "taskStatus",
        "value": "Cerrada",
        "parentId": null,
        "key": "Cerrada",
        "description": ""
    },
    {
        "id": 1,
        "field": "taskStatus",
        "value": "Pendiente",
        "parentId": null,
        "key": "Pendiente",
        "description": ""
    }];

let dispatchShowLoading;
let dispatchGetMasterDataFields;
let dispatchSwtShowMessage;
let dispatchGetInfoTaskUser;
let dispatchCreatePendingTaskNew;
let dispatchClearUserTask;
let dispatchFillComments;
let dispatchGetCurrentComments;
let dispatchConsultInfoClient;
let dispatchSaveTaskNote;
let dispatchGetTaskNotesByUserTaskId;
let filterUsersBancoDispatch;
let selectsReducer;
let setFieldValue;
let closeModal;
let defaultProps = {};
let redirectUrl;
let stubLocalStorage;
let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let dispatchShowBrandConfidential;

describe('Test taskPage', () => {
    beforeEach(() => {
        dispatchShowLoading = spy(sinon.fake());
        dispatchGetMasterDataFields = sinon.stub();
        dispatchSwtShowMessage = spy(sinon.fake());
        dispatchGetInfoTaskUser = sinon.stub();
        dispatchGetInfoTaskUser.resolves({
           payload:{
               data:{
                   data:{
                       id: 1234,
                       notes: []
                   }
               }
           }
        });
        dispatchClearUserTask = sinon.stub();
        dispatchCreatePendingTaskNew = sinon.stub();
        filterUsersBancoDispatch = sinon.stub();
        dispatchCreatePendingTaskNew.resolves({
            payload: {
                data: {
                    validateLogin: true,
                    status: REQUEST_SUCCESS
                }
            }
        });
        dispatchFillComments = sinon.fake();
        dispatchGetCurrentComments = sinon.fake();
        dispatchSaveTaskNote = sinon.fake();
        dispatchConsultInfoClient = sinon.stub();
        dispatchGetTaskNotesByUserTaskId = sinon.stub();
        dispatchGetTaskNotesByUserTaskId.resolves({
            payload: {
                data: {
                    status: REQUEST_SUCCESS,
                    data: []
                }
            }
        });
        dispatchConsultInfoClient.resolves({});
        selectsReducer = Immutable.Map({taskStates: taskStates});
        dispatchGetMasterDataFields.resolves({
            masterDataDetailEntries: taskStates
        });
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
        setFieldValue = sinon.stub();
        closeModal = spy(sinon.fake());
        defaultProps = {
            params: {},
            clientInformacion: Immutable.Map({
                responseClientInfo: {
                    name: 'Cristhian',
                    clientDetailsRequest: {opportunities: []}
                }
            }),
            myPendingsReducer: Immutable.Map({
                task:{
                    data: {
                        id: 53453,
                        notes: [],
                        assignedBy: 'Daniel Gallego'
                    }
                }
            }),
            reducerGlobal: Immutable.Map({
                validateEnter,
                permissionsTasks: [EDITAR]
            }),
            commentsReducer: {
                comments: []
            },
            selectsReducer,
            dispatchShowLoading,
            dispatchGetMasterDataFields,
            dispatchSwtShowMessage,
            dispatchCreatePendingTaskNew,
            dispatchClearUserTask,
            dispatchGetInfoTaskUser,
            filterUsersBancoDispatch,
            dispatchFillComments,
            dispatchGetCurrentComments,
            dispatchConsultInfoClient,
            dispatchSaveTaskNote,
            dispatchGetTaskNotesByUserTaskId,
            fromModal: false,
            closeModal,
            dispatchShowBrandConfidential
        };
        store = mockStore({
            defaultProps
        });
        dispatchShowBrandConfidential = spy(sinon.fake());
    });

    afterEach(() => {
        redirectUrl.restore();
    });

    describe('Rendering unit test', () => {
        it('Should render taskPage', () => {
            itRenders(<TaskPage {...defaultProps}/>);
        });

        it('should redirectUrl when render taskPage', () => {
            defaultProps.clientInformacion = Immutable.Map({responseClientInfo: {}});
            itRenders(<TaskPage {...defaultProps}/>);
            sinon.assert.called(redirectUrl);
        });

        it('should unmount taskPage component', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.instance().componentWillUnmount();
            sinon.assert.called(dispatchClearUserTask);
        });

        it('should render ReportsHeader', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            expect(wrapper.find(<ReportsHeader/>))
        });

        it('should render Editar button when validatePermissionsTask is true and state isEditable is true', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.instance().validatePermissionsTask = () => {
                return true;
            };
            wrapper.update();
            wrapper.setState({isEditable: true});
            expect(wrapper.find('.modal-button-edit')).to.have.lengthOf(1);
        });

        it('shouldnt render Editar button when validatePermissionsTask is false and state isEditable is true', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.instance().validatePermissionsTask = () => {
                return false;
            };
            wrapper.update();
            wrapper.setState({isEditable: true});
            expect(wrapper.find('.modal-button-edit')).to.have.lengthOf(0);
        });

        it('shouldnt render Editar button when validatePermissionsTask is true and state isEditable is false', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.instance().validatePermissionsTask = () => {
                return true;
            };
            wrapper.update();
            wrapper.setState({isEditable: false});
            expect(wrapper.find('.modal-button-edit')).to.have.lengthOf(0);
        });

        it('should render TaskFormComponent when state renderForm is true', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.setState({renderForm: true});
            expect(wrapper.find(TaskFormComponent)).to.have.lengthOf(1);
        });

        it('shouldnt render TaskFormComponent when state renderForm is false', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.setState({renderForm: false});
            expect(wrapper.find(TaskFormComponent)).to.have.lengthOf(0);
        });

        it('should render SweetAlert child component', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            expect(wrapper.find(SweetAlert)).to.have.lengthOf(1);
        });

        it('should render title task edit', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            const result = wrapper.instance().renderTitleSubmitAlert(123);
            expect(result).to.equal(TITLE_TASK_EDIT);
        });

        it('should render title task create', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            const result = wrapper.instance().renderTitleSubmitAlert();
            expect(result).to.equal(TITLE_TASK_CREATE);
        });

        it('should render title message submit alert success edit', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            const result = wrapper.instance().renderMessageSubmitAlertSuccess(123);
            expect(result).to.equal(MESSAGE_TASK_EDIT_SUCCESS);
        });

        it('should render title message submit alert success create', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            const result = wrapper.instance().renderMessageSubmitAlertSuccess();
            expect(result).to.equal(MESSAGE_TASK_CREATE_SUCCESS);
        });

        it('should render title message submit alert error edit', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            const result = wrapper.instance().renderMessageSubmitAlertError(123);
            expect(result).to.equal(MESSAGE_TASK_EDIT_ERROR);
        });

        it('should render title message submit alert error create', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            const result = wrapper.instance().renderMessageSubmitAlertError();
            expect(result).to.equal(MESSAGE_TASK_CREATE_ERROR);
        });

        it('should call dispatchConsultInfoClient when idClient is not null in componentWillMount', () => {
            defaultProps.idClient = 123132;
            itRenders(<TaskPage {...defaultProps}/>);
            expect(dispatchConsultInfoClient.called).to.equal(true);
        });
    });

    describe('Actions unit test', () => {
        it('onClickCancelCommercialReport should change showConfirmationCancelTask state to true', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.instance().onClickCancelCommercialReport();
            expect(wrapper.state().showConfirmationCancelTask).to.equal(true);
        });

        it('onClickConfirmCancelCommercialReport should call redirectUrl and change showConfirmationCancelTask to false', () => {
            defaultProps.fromModal = false;
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.instance().onClickConfirmCancelCommercialReport();
            expect(wrapper.state().showConfirmationCancelTask).to.equal(false);
            expect(redirectUrl.calledOnce).to.equal(true);
        });

        it('onClickConfirmCancelCommercialReport should call closeModal and change showConfirmationCancelTask to false', () => {
            defaultProps.fromModal = true;
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.instance().onClickConfirmCancelCommercialReport();
            expect(wrapper.state().showConfirmationCancelTask).to.equal(false);
            sinon.assert.notCalled(redirectUrl);
        });

        it('masterDataFields should call getMasterDataFields service', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.instance().masterDataFields();
            expect(dispatchGetMasterDataFields.called).to.equal(true);
        });

        it('validatePermissionsTask should return true when isEditable state is true', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.setState({isEditable: true});
            const result = wrapper.instance().validatePermissionsTask();
            expect(result).to.equal(true);
        });

        it('validatePermissionsTask should return false when isEditale state is false', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.setState({isEditable: false});
            const result = wrapper.instance().validatePermissionsTask();
            expect(result).to.equal(false);
        });

        it('validatePermissionsTask should return false when permissionsTask doesnt contains Editar', () => {
            defaultProps.reducerGlobal = Immutable.Map({
                validateEnter,
                permissionsTasks: []
            });
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.setState({isEditable: true});
            const result = wrapper.instance().validatePermissionsTask();
            expect(result).to.equal(false);
        });

        it('getInfoTask should call service getInfoTaskUser', async () => {
            defaultProps.dispatchGetInfoTaskUser = dispatchGetInfoTaskUser;
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            await wrapper.instance().getInfoTask(1234);
            expect(wrapper.state().isEditable).to.equal(true);
        });

        it('getInfoTask shouldnt call service getInfoTaskUser', async () => {
            defaultProps.dispatchGetInfoTaskUser = dispatchGetInfoTaskUser;
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            await wrapper.instance().getInfoTask();
            expect(wrapper.state().isEditable).to.equal(false);
        });

        it('submitForm should call saveTask service', async () => {
            const request = {
                id: 1,
                clientId: 123,
                task: "Validar con integración el servicio de consultaGrupoEconómico",
                advance: "Se valida con integración",
                status: 1,
                finalDate: new Date(),
                employeeName: 'Cristhian',
                responsible: 1234
            };
            defaultProps.fromModal = true;
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.calledOnce(dispatchCreatePendingTaskNew);
            expect(dispatchShowLoading).to.have.been.called.exactly(3);
            expect(dispatchSwtShowMessage).to.have.been.called.once;
        });

        it('submitForm should call saveTask service', async () => {
            const request = {
                id: 1,
                clientId: 123,
                task: "Validar con integración el servicio de consultaGrupoEconómico",
                advance: "Se valida con integración",
                status: 1,
                finalDate: new Date(),
                employeeName: 'Cristhian',
                responsible: 1234
            };
            defaultProps.fromModal = false;
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.calledOnce(dispatchCreatePendingTaskNew);
            expect(dispatchShowLoading).to.have.been.called.exactly(3);
            expect(dispatchSwtShowMessage).to.have.been.called.once;
        });

        it('submitForm should call saveTask service and respond a validateLogin false and fromModal is true', async () => {
            const request = {
                id: 1,
                clientId: 123,
                task: "Validar con integración el servicio de consultaGrupoEconómico",
                advance: "Se valida con integración",
                status: 1,
                finalDate: new Date(),
                employeeName: 'Cristhian',
                responsible: 1234
            };
            dispatchCreatePendingTaskNew.resolves({
                payload: {
                    data: {
                        validateLogin: false,
                        status: REQUEST_SUCCESS
                    }
                }
            });
            defaultProps.fromModal = true;
            defaultProps.dispatchCreatePendingTaskNew = dispatchCreatePendingTaskNew;
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.calledOnce(dispatchCreatePendingTaskNew);
            expect(dispatchShowLoading).to.have.been.called.exactly(3);
            sinon.assert.notCalled(redirectUrl);
        });

        it('submitForm should call saveTask service and respond a validateLogin false and fromModal is false', async () => {
            const request = {
                id: 1,
                clientId: 123,
                task: "Validar con integración el servicio de consultaGrupoEconómico",
                advance: "Se valida con integración",
                status: 1,
                finalDate: new Date(),
                employeeName: 'Cristhian',
                responsible: 1234
            };
            defaultProps.fromModal = false;
            dispatchCreatePendingTaskNew.resolves({
                payload: {
                    data: {
                        validateLogin: false,
                        status: REQUEST_SUCCESS
                    }
                }
            });
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.calledOnce(dispatchCreatePendingTaskNew);
            expect(dispatchShowLoading).to.have.been.called.exactly(3);
            sinon.assert.calledOnce(redirectUrl);
        });

        it('submitForm should call saveTask service and response status 422', async () => {
            const request = {
                id: 1,
                clientId: 123,
                task: "Validar con integración el servicio de consultaGrupoEconómico",
                advance: "Se valida con integración",
                status: 1,
                finalDate: new Date(),
                employeeName: 'Cristhian',
                responsible: 1234
            };
            defaultProps.fromModal = false;
            dispatchCreatePendingTaskNew.resolves({
                payload: {
                    data: {
                        validateLogin: true,
                        status: REQUEST_INVALID_INPUT
                    }
                }
            });
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.calledOnce(dispatchCreatePendingTaskNew);
            expect(dispatchShowLoading).to.have.been.called.exactly(3);
        });

        it('submitForm should call saveTask service and response status 500', async () => {
            const request = {
                id: 1,
                clientId: 123,
                task: "Validar con integración el servicio de consultaGrupoEconómico",
                advance: "Se valida con integración",
                status: 1,
                finalDate: new Date(),
                employeeName: 'Cristhian',
                responsible: 1234
            };
            defaultProps.fromModal = false;
            dispatchCreatePendingTaskNew.resolves({
                payload: {
                    data: {
                        validateLogin: true,
                        status: REQUEST_ERROR
                    }
                }
            });
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.calledOnce(dispatchCreatePendingTaskNew);
            expect(dispatchShowLoading).to.have.been.called.exactly(3);
        });

        it('editTask should call canUserEditTask', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            stubLocalStorage = sinon.stub(window.localStorage, 'getItem').returns("Crarios");
            wrapper.instance().editTask();
            stubLocalStorage.restore();
            expect(dispatchShowLoading).to.have.been.called.exactly(1);
        });

        it('editTask should call canUserEditTask when isEditable', () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            wrapper.setState({isEditable: true});
            wrapper.instance().canUserEditTask ();
            expect(wrapper.state().showMessage).to.equal(false);
            expect(wrapper.state().isEditable).to.equal(false);
        });

        it('saveTaskComment should call dispatchSaveTaskNote', async () => {
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            const getTaskNotesByUserTaskIdFunction = sinon.stub();
            const comment = {
                id: null,
                content: 'Algo',
                author: 'Daniel Gallego',
                parentCommentId: null
            };
            wrapper.instance().getTaskNotesByUserTaskId = getTaskNotesByUserTaskIdFunction;
            await wrapper.instance().saveTaskComment(comment);
            expect(dispatchSaveTaskNote.called).to.equal(true);
            expect(getTaskNotesByUserTaskIdFunction.called).to.equal(true);
        });

        it('getTaskNotesByUserTaskId should call dispatchFillComments when request is success', async () => {
            defaultProps.params.id = 1231;
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            await wrapper.instance().getTaskNotesByUserTaskId();
            expect(dispatchGetTaskNotesByUserTaskId.called).to.equal(true);
            expect(dispatchFillComments.called).to.equal(true);
        });

        it('getTaskNotesByUserTaskId should not call dispatchFillComments when request is error', async () => {
            defaultProps.params.id = 1231;
            defaultProps.dispatchGetTaskNotesByUserTaskId.resolves({
                payload: {
                    data: {
                        status: REQUEST_ERROR,
                        data: []
                    }
                }
            });
            const wrapper = shallow(<TaskPage {...defaultProps}/>);
            await wrapper.instance().getTaskNotesByUserTaskId();
            expect(dispatchGetTaskNotesByUserTaskId.called).to.equal(true);
        });

    });

    describe('Redux Component test', () => {
        it('should render react component', () => {
            itRenders(<TaskPageRedux store={store}/>);
        })
    });
});

