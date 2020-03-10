import React from 'react';
import {redirectUrl} from "../globalComponents/actions";
import {connect} from 'react-redux';
import {ComponentClientInformationURL, LoginComponentURL} from "../../constantsAnalytics";
import {TASK_STATUS} from "../selectsComponent/constants";
import {
    AFFIRMATIVE_ANSWER,
    CANCEL,
    EDITAR,
    MESSAGE_SAVE_DATA,
    REQUEST_INVALID_INPUT,
    REQUEST_SUCCESS
} from "../../constantsGlobal";
import {
    MESSAGE_EXIT_CONFIRMATION,
    MESSAGE_TASK_CREATE_ERROR,
    MESSAGE_TASK_CREATE_SUCCESS,
    MESSAGE_TASK_EDIT_ERROR,
    MESSAGE_TASK_EDIT_SUCCESS,
    MESSAGE_TASK_INVALID_INPUT,
    TITLE_EXIT_CONFIRMATION,
    TITLE_TASK_CREATE,
    TITLE_TASK_EDIT
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
import {getInfoTaskUser} from '../myPendings/myTasks/actions';
import {clearTask} from "./actions";
import _ from 'lodash';
import {consultInfoClient} from "../clientInformation/actions";
import CommentsComponent from "../globalComponents/comments/commentsComponent";
import {fillComments, getCurrentComments} from "../globalComponents/comments/actions";

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
        const { idClient, dispatchConsultInfoClient } = this.props;
        if(idClient){
            window.sessionStorage.setItem('idClientSelected', idClient);
            dispatchConsultInfoClient().then(this.validateClientSelected);
        }else{
            this.validateClientSelected();
        }
    }

    componentDidMount() {
        const {params: {id}, dispatchShowLoading} = this.props;
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

    validateClientSelected = () => {
        const { clientInformacion } = this.props;
        if (_.isEmpty(clientInformacion.get('responseClientInfo'))) {
            redirectUrl(ComponentClientInformationURL)
        }
    };

    masterDataFields = async () => {
        const {dispatchGetMasterDataFields} = this.props;
        await dispatchGetMasterDataFields([TASK_STATUS]);
    };

    validatePermissionsTask = () => {
        const {reducerGlobal} = this.props;
        return _.get(reducerGlobal.get('permissionsTasks'), _.indexOf(reducerGlobal.get('permissionsTasks'), EDITAR), false) && this.state.isEditable;
    };

    submitForm = async (task) => {
        const {params: {id}, dispatchShowLoading, dispatchCreatePendingTaskNew, dispatchSwtShowMessage, dispatchGetCurrentComments, fromModal, closeModal, commentsReducer} = this.props;
        if (moment(task.finalDate, 'DD/MM/YYYY').isValid()) {
            dispatchGetCurrentComments();
            const taskRequest = {
                "id": id,
                "clientId": window.sessionStorage.getItem('idClientSelected'),
                "task": task.task,
                "advance": task.advance,
                "status": task.idStatus,
                "closingDate": task.finalDate !== '' && task.finalDate !== null && task.finalDate !== undefined ? moment(task.finalDate, "DD/MM/YYYY").format('x') : null,
                "employeeName": task.employeeName,
                "employeeId": task.responsible !== undefined && task.responsible !== null && task.responsible !== '' ? task.responsible : null,
                "notes": commentsReducer.comments
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
        const {fromModal, closeModal, dispatchSwtShowMessage} = this.props;
        if (fromModal) {
            dispatchSwtShowMessage('success', this.renderTitleSubmitAlert(taskId), this.renderMessageSubmitAlertSuccess(taskId), {onConfirmCallback: () => closeModal()});
        } else {
            dispatchSwtShowMessage('success', this.renderTitleSubmitAlert(taskId), this.renderMessageSubmitAlertSuccess(taskId), {onConfirmCallback: () => redirectUrl(url)});
        }
    };

    editTask = async () => {
        const usernameSession = window.localStorage.getItem('userNameFront');
        await this.canUserEditTask(usernameSession);
    };

    canUserEditTask = () => {
        if (this.state.isEditable) {
            this.setState({
                showMessage: false,
                isEditable: false
            })
        }
    };

    onClickCancelCommercialReport = () => {
        this.setState({showConfirmationCancelTask: true});
    };

    onClickConfirmCancelCommercialReport = () => {
        const {fromModal, closeModal} = this.props;
        this.setState({showConfirmationCancelTask: false});
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
        const {dispatchGetInfoTaskUser} = this.props;
        if (id) {
            await dispatchGetInfoTaskUser(id);
            this.setState({
                isEditable: true,
                formValid: true
            });
        } else {
            this.setState({
                isEditable: false
            });
        }
    };

    renderForm = () => {
        const {params: {id}, selectsReducer, fromModal, myPendingsReducer} = this.props;
        const taskDetail = myPendingsReducer.get('task') ? myPendingsReducer.get('task').data : null;
        return (
            <TaskFormComponent
                taskData={taskDetail}
                stateTask={selectsReducer.get(TASK_STATUS)}
                onSubmit={this.submitForm}
                isEditable={this.state.isEditable}
                creatingReport={id}
                commercialReportButtons={() => (
                    <CommercialReportButtonsComponent
                        definitiveSaveTitle={'Guardar'}
                        cancel={this.onClickCancelCommercialReport}
                        fromModal={fromModal}
                        isEditable={this.state.isEditable}
                        documentDraft={true}
                    />)}>
                <CommentsComponent
                    header="Notas"
                    reportId={id}
                    disabled={this.state.isEditable}/>
            </TaskFormComponent>
        );
    };

    render() {
        const {isEditable} = this.state;
        const {fromModal} = this.props;
        return (
            <div className='previsit-container'>
                {!fromModal &&
                    <ReportsHeader/>
                }
                <div style={{backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px"}}>
                    <Row style={{padding: "5px 10px 0px 20px"}}>
                        <Col xs={10} sm={10} md={10} lg={10}>
                            <span>Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2}>
                            {
                                this.validatePermissionsTask() && isEditable &&
                                <button type="button" onClick={this.editTask}
                                        className={'btn btn-primary modal-button-edit'}
                                        style={{marginRight: '15px', float: 'right', marginTop: '-15px'}}>
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
                    confirmButtonText={AFFIRMATIVE_ANSWER}
                    cancelButtonText={CANCEL}
                    showCancelButton={true}
                    onCancel={() => this.setState({showConfirmationCancelTask: false})}
                    onConfirm={this.onClickConfirmCancelCommercialReport}/>
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
        dispatchClearUserTask: clearTask,
        dispatchConsultInfoClient: consultInfoClient,
        dispatchGetCurrentComments: getCurrentComments,
        dispatchFillComments: fillComments
    }, dispatch);
}

function mapStateToProps({clientInformacion, reducerGlobal, selectsReducer, usersPermission, tasksByClient, myPendingsReducer, commentsReducer}) {
    return {
        clientInformacion,
        reducerGlobal,
        selectsReducer,
        usersPermission,
        tasksByClient,
        myPendingsReducer,
        commentsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPage);