import React from 'react';
import {redirectUrl} from "../globalComponents/actions";
import {connect} from 'react-redux';
import {ComponentClientInformationURL, LoginComponentURL} from "../../constantsAnalytics";
import {TASK_STATUS} from "../selectsComponent/constants";
import {
    AFFIRMATIVE_ANSWER,
    CANCEL,
    EDITAR,
    MESSAGE_SAVE_DATA, MODULE_BUSSINESS_PLAN, MODULE_VISITS,
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
import {filterUsers} from "../commercialReport/actions";
import ButtonDetailsRedirectComponent from "../grid/buttonDetailsRedirectComponent";
import {detailBusiness} from "../businessPlan/actions";
import {detailVisit} from "../visit/actions";
import {validatePermissionsByModule} from "../../actionsGlobal";
import {getTaskNotesByUserTaskId, saveTaskNote} from "./createPendingTask/actions";

let nameEntity;

export class TaskPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditable: false,
            showMessage: false,
            showConfirmationCancelTask: false,
            shouldRedirect: false,
            renderForm: false,
            nameUsuario: ''
        };
        this.entityId = null;
    }

    componentWillMount() {
        const {idClient, dispatchConsultInfoClient} = this.props;
        if (idClient) {
            window.sessionStorage.setItem('idClientSelected', idClient);
            dispatchConsultInfoClient().then(this.validateClientSelected);
        } else {
            this.validateClientSelected();
        }

    }

    async componentDidMount() {
        const {params: {id}, dispatchShowLoading, filterUsersBancoDispatch, myPendingsReducer, dispatchFillComments} = this.props;
        dispatchShowLoading(true, "Cargando...");

        Promise.all([this.masterDataFields(), this.getInfoTask(id)]).then(async () => {
            this.setState({
                renderForm: true,
                isMounted: true
            });
            dispatchShowLoading(false, "");
            let userName = window.localStorage.getItem("userNameFront");
            const filterUserResponse = await filterUsersBancoDispatch(userName);
            const taskDetail = myPendingsReducer.get('task') ? myPendingsReducer.get('task').data : null;
            if(taskDetail) {
                dispatchFillComments(taskDetail.notes);
                this.setState({
                    nameUsuario: taskDetail.assignedBy
                });
            }else{
                await this.setState({
                    nameUsuario: _.get(filterUserResponse, 'payload.data.data[0].title')
                });
            }
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
        const { dispatchGetInfoTaskUser, dispatchFillComments, dispatchDetailBusiness, dispatchDetailVisit, dispatchValidatePermissionsByModule } = this.props;
        if (id) {
            const response = await dispatchGetInfoTaskUser(id);
            const taskInfo = _.get(response, 'payload.data.data');
            dispatchFillComments(taskInfo.notes);
            nameEntity = taskInfo.nameEntity;
            this.entityId = taskInfo.entityId;
            if (taskInfo.nameEntity === 'Plan de negocio') {
                dispatchValidatePermissionsByModule(MODULE_BUSSINESS_PLAN);
                dispatchDetailBusiness(taskInfo.entityId);
            } else if (taskInfo.nameEntity === 'Visita') {
                dispatchValidatePermissionsByModule(MODULE_VISITS);
                dispatchDetailVisit(taskInfo.entityId);
            }
            this.setState({
                isEditable: true,
                formValid: true,
                nameUsuario: taskInfo.assignedBy
            });
        } else {
            this.setState({ isEditable: false });
        }
    };

    saveTaskComment = async (comment) => {
        const { dispatchSaveTaskNote } = this.props;
        await dispatchSaveTaskNote(comment);
        await this.getTaskNotesByUserTaskId();
    };

    getTaskNotesByUserTaskId = async () => {
        const { params: {id}, dispatchGetTaskNotesByUserTaskId, dispatchFillComments } = this.props;
        const getNotesResponse = await dispatchGetTaskNotesByUserTaskId(id);
        if(_.get(getNotesResponse, 'payload.data.status') === REQUEST_SUCCESS) {
            const notes = _.get(getNotesResponse, 'payload.data.data');
            dispatchFillComments(notes);
        }
    };

    handleRelationLink = () => {
        const {businessPlanReducer, visitReducer} = this.props;
        let actionsRedirect;
        let detail;
        switch (nameEntity) {
            case "Plan de negocio":
                detail = businessPlanReducer.get("detailBusiness");
                actionsRedirect = {
                    typeClickDetail: "businessPlan",
                    ownerDraft: detail.data.documentStatus,
                    idClient: this.clientId,
                    urlRedirect: "/dashboard/businessPlanEdit",
                    id: this.entityId
                };
                break;
            case"Visita":
                detail = visitReducer.get("detailVisit");
                actionsRedirect = {
                    typeClickDetail: "visita",
                    ownerDraft: detail.data.documentStatus,
                    idClient: this.clientId,
                    urlRedirect: "/dashboard/visitaEditar",
                    id: this.entityId
                };
                break;
            default:
                break;
        }
        return actionsRedirect;
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
                    disabled={this.state.isEditable}
                    saveCommentAction={this.saveTaskComment}/>
            </TaskFormComponent>
        );
    };

    render() {
        const {isEditable} = this.state;
        const {fromModal} = this.props;
        return (
            <div style={{marginBottom: '5em'}}>
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
                <div style={{backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px"}}>
                    <Col style={{padding: "5px 10px 0px 20px"}}>
                        <strong>Asignador</strong><br/>
                        <span id="asignator" style={{fontWeight: 'normal'}}> {this.state.nameUsuario}</span>
                    </Col>
                </div>
                {
                    this.state.renderForm ? this.renderForm() : null
                }
                {nameEntity &&
                <div className="modalBt4-footer modal-footer" style={{zIndex: 2}}>

                        <Row xs={12} md={12} lg={12}>
                            <Col xs={6} md={10} lg={10}
                                 style={{textAlign: "left", varticalAlign: "middle", marginLeft: "0px"}}>
                                {!_.isNull(this.entityId) ?
                                    <span style={{fontWeight: "bold", color: "#818282"}}>Pendiente de {nameEntity}
                                        <span style={{paddingLeft: "2em"}}>
                                        <ButtonDetailsRedirectComponent actionsRedirect={() => {
                                            return this.handleRelationLink()
                                        }}/>
                                      </span>
                                    </span>
                                    : <span
                                        style={{fontWeight: "bold", color: "#818282"}}>Pendiente de {nameEntity}</span>
                                }
                            </Col>
                        </Row>

                </div>
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
        filterUsersBancoDispatch: filterUsers,
        dispatchGetCurrentComments: getCurrentComments,
        dispatchFillComments: fillComments,
        dispatchSaveTaskNote: saveTaskNote,
        dispatchGetTaskNotesByUserTaskId: getTaskNotesByUserTaskId,
        dispatchDetailBusiness: detailBusiness,
        dispatchDetailVisit: detailVisit,
        dispatchValidatePermissionsByModule: validatePermissionsByModule
    }, dispatch);
}

function mapStateToProps(
    {
        clientInformacion,
        reducerGlobal,
        selectsReducer,
        usersPermission,
        tasksByClient,
        myPendingsReducer,
        commentsReducer,
        businessPlanReducer,
        visitReducer
    }) {
    return {
        clientInformacion,
        reducerGlobal,
        selectsReducer,
        usersPermission,
        tasksByClient,
        myPendingsReducer,
        businessPlanReducer,
        visitReducer,
        commentsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPage);