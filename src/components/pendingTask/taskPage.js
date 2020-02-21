import React from 'react';
import {redirectUrl} from "../globalComponents/actions";
import {connect} from 'react-redux';
import {ComponentClientInformationURL, LoginComponentURL} from "../../constantsAnalytics";
import {TASK_STATUS} from "../selectsComponent/constants";
import {
    AFIRMATIVE_ANSWER,
    CANCEL,
    EDITAR,
    MESSAGE_SAVE_DATA,
    REQUEST_INVALID_INPUT,
    REQUEST_SUCCESS
} from "../../constantsGlobal";
import {
    MESSAGE_TASK_CREATE_ERROR,
    MESSAGE_TASK_CREATE_SUCCESS,
    MESSAGE_TASK_EDIT_ERROR,
    MESSAGE_TASK_EDIT_SUCCESS,
    MESSAGE_TASK_INVALID_INPUT,
    TITLE_TASK_CREATE,
    TITLE_TASK_EDIT,
    MESSAGE_EXIT_CONFIRMATION,
    TITLE_EXIT_CONFIRMATION
} from "./constants";
import {bindActionCreators} from "redux";
import ReportsHeader from "../../components/globalComponents/reportsHeader/component";
import {Col, Row} from "react-flexbox-grid";
import SweetAlert from "../sweetalertFocus";
import TaskFormComponent from "./taskFormComponent";
import {getMasterDataFields} from "../selectsComponent/actions";
import {showLoading} from "../loading/actions";
import CommercialReportButtonsComponent from "../globalComponents/commercialReportButtonsComponent";
import {createPendingTaskNew} from "./createPendingTask/actions.js";
import {swtShowMessage} from "../sweetAlertMessages/actions";
import moment from "moment";
import { getInfoTaskUser } from '../myPendings/myTasks/actions';
import {clearUserTask} from "./actions";

export class TaskPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditable: false,
            showMessage: false,
            showConfirmationCancelTask: false,
            shouldRedirect: false,
            renderForm: false
        }
    }

    componentWillMount() {
        const { clientInformacion } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        if (_.isEmpty(infoClient)) {
            redirectUrl(ComponentClientInformationURL)
        }
    }

    componentDidMount() {
        const { params: { id }, dispatchShowLoading } = this.props;
        dispatchShowLoading(true, "Cargando...");

        Promise.all([this.masterDataFields(), this.getInfoTask(id)]).then(() => {
            this.setState({
                renderForm: true,
                isMounted: true
            });
            dispatchShowLoading(false, "");
        });
    }

    componentWillUnmount() {
        const {dispatchClearUserTask} = this.props;
        this.setState({
            isMounted: false
        });
        dispatchClearUserTask();
    }

    masterDataFields = async () => {
        const { dispatchGetMasterDataFields } = this.props;
        await dispatchGetMasterDataFields([TASK_STATUS]);
    };

    validatePermissionsTask = () => {
        const { reducerGlobal } = this.props;
        return _.get(reducerGlobal.get('permissionsTasks'), _.indexOf(reducerGlobal.get('permissionsTasks'), EDITAR), false) && this.state.isEditable;
    };


    submitForm = async (task) => {
        const { params: { id }, dispatchShowLoading, dispatchCreatePendingTaskNew, dispatchSwtShowMessage, fromModal, closeModal } = this.props;

        if (moment(task.finalDate, 'DD/MM/YYYY').isValid()) {
            const taskRequest = {
                "id": id,
                "clientId": window.sessionStorage.getItem('idClientSelected'),
                "task": task.task,
                "advance": task.advance,
                "status": task.idStatus,
                "closingDate": task.finalDate !== '' && task.finalDate !== null && task.finalDate !== undefined ? moment(task.finalDate, "DD/MM/YYYY").format('x') : null,
                "employeeName": task.userName,
                "employeeId": task.idResponsable !== undefined && task.idResponsable !== null && task.idResponsable !== '' ? task.idResponsable : null,
            };
            dispatchShowLoading(true, MESSAGE_SAVE_DATA);
            const responseCreateTask = await dispatchCreatePendingTaskNew(taskRequest);
            dispatchShowLoading(false, "");
            if (!_.get(responseCreateTask, 'payload.data.validateLogin') || _.get(responseCreateTask, 'payload.data.validateLogin') === 'false') {
                if (fromModal) {
                    closeModal();
                } else {
                    redirectUrl(LoginComponentURL);
                }
            } else if (_.get(responseCreateTask, 'payload.data.status') === REQUEST_SUCCESS) {
                this.redirectionAfterSubmit(id, ComponentClientInformationURL)
            } else if (_.get(responseCreateTask, 'payload.data.status') === REQUEST_INVALID_INPUT) {
                dispatchSwtShowMessage('error', this.renderTitleSubmitAlert(id), MESSAGE_TASK_INVALID_INPUT);
            } else {
                dispatchSwtShowMessage('error', this.renderTitleSubmitAlert(id), this.renderMessageSubmitAlertError(id));
            }
        }
    };

    redirectionAfterSubmit = (taskId, url) => {
        const {fromModal, closeModal, dispatchSwtShowMessage } = this.props;
        if (fromModal) {
            dispatchSwtShowMessage('success', this.renderTitleSubmitAlert(taskId), this.renderMessageSubmitAlertSuccess(taskId), { onConfirmCallback: () => closeModal() });
        } else {
            dispatchSwtShowMessage('success', this.renderTitleSubmitAlert(taskId), this.renderMessageSubmitAlertSuccess(taskId), { onConfirmCallback: () => redirectUrl(url) });
        }
    };

    editTask = async () => {
        const usernameSession = window.localStorage.getItem('userNameFront');
        await this.canUserEditTask(usernameSession);
    };

    canUserEditTask = async (myUserName) => {
        /*debugger;
        const {myPendingsReducer} = this.props;
        let userName = myPendingsReducer.get('userName');
        if (userName.toUpperCase() === myUserName.toUpperCase()) {*/
            if (this.state.isEditable) {
                this.setState({
                    showMessage: false,
                    isEditable: false
                })
            }
        /*}*/
    };

    onClickCancelCommercialReport = () => {
        this.setState({ showConfirmationCancelTask: true });
    };

    onClickConfirmCancelCommercialReport = () => {
        const { fromModal, closeModal } = this.props;
        this.setState({ showConfirmationCancelTask: false });
        if (fromModal) {
            closeModal();
        } else {
            redirectUrl(ComponentClientInformationURL);
        }
    };

    renderTitleSubmitAlert = (id) => {
        return id ? TITLE_TASK_EDIT : TITLE_TASK_CREATE;
    };

    renderMessageSubmitAlertSuccess = (id) => {
        return id ? MESSAGE_TASK_EDIT_SUCCESS : MESSAGE_TASK_CREATE_SUCCESS;
    };

    renderMessageSubmitAlertError = (id) => {
        return id ? MESSAGE_TASK_EDIT_ERROR : MESSAGE_TASK_CREATE_ERROR;
    };

    getInfoTask = async (id) => {
        const { dispatchGetInfoTaskUser, selectsReducer } = this.props;
        if (id) {
            const response = await dispatchGetInfoTaskUser(id);
            const taskDetail = response.payload.data.data;
            const taskState = _.find(selectsReducer.get(TASK_STATUS), ['id', taskDetail.state]);
            this.setState({
                isEditable: true,
                currentTaskState: taskState ? taskState.key.toUpperCase() : '',
                formValid: true
            });
        } else {
            this.setState({
                isEditable: false
            });
        }
    };

    renderForm = () => {
        const {params: { id }, selectsReducer, fromModal, myPendingsReducer} = this.props;
        const taskDetail = myPendingsReducer.get('task') ? myPendingsReducer.get('task').data : null;
        return (
            <TaskFormComponent
                taskData={taskDetail}
                stateTask={selectsReducer.get(TASK_STATUS)}
                onSubmit={this.submitForm}
                isEditable={this.state.isEditable}
                creatingReport={id}
                commercialReportButtons={(setFieldValue) => (
                    <CommercialReportButtonsComponent
                        definitiveSaveTitle={'Guardar'}
                        onClickSave={draft => setFieldValue('documentStatus', draft, true)}
                        cancel={this.onClickCancelCommercialReport}
                        fromModal={fromModal}
                        isEditable={this.state.isEditable}
                        documentDraft={true}
                        creatingReport={id}
                    />)}
            />
        );
    };

    render() {
        const { isEditable } = this.state;
        return (
            <div className='previsit-container'>
                <ReportsHeader />
                <div style={{ backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>
                    <Row style={{ padding: "5px 10px 0px 20px" }}>
                        <Col xs={10} sm={10} md={10} lg={10}>
                            <span>Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2}>
                            {
                                this.validatePermissionsTask() && isEditable &&
                                <button type="button" onClick={this.editTask}
                                        className={'btn btn-primary modal-button-edit'}
                                        style={{ marginRight: '15px', float: 'right', marginTop: '-15px' }}>
                                    Editar <i className={'icon edit'}/>
                                </button>
                            }
                        </Col>
                    </Row>
                </div>
                {
                    this.state.renderForm ? this.renderForm() : null
                }
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmationCancelTask}
                    title={TITLE_EXIT_CONFIRMATION}
                    text={MESSAGE_EXIT_CONFIRMATION}
                    confirmButtonColor='#DD6B55'
                    confirmButtonText={AFIRMATIVE_ANSWER}
                    cancelButtonText={CANCEL}
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmationCancelTask: false })}
                    onConfirm={this.onClickConfirmCancelCommercialReport} />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchGetInfoTaskUser: getInfoTaskUser,
        dispatchSwtShowMessage: swtShowMessage,
        dispatchShowLoading: showLoading,
        dispatchGetMasterDataFields: getMasterDataFields,
        dispatchCreatePendingTaskNew: createPendingTaskNew,
        dispatchClearUserTask: clearUserTask
    }, dispatch);
}

function mapStateToProps({ clientInformacion, reducerGlobal, selectsReducer, usersPermission, tasksByClient, myPendingsReducer }) {
    return {
        clientInformacion,
        reducerGlobal,
        selectsReducer,
        usersPermission,
        tasksByClient,
        myPendingsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPage);