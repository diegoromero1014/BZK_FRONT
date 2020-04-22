import React, { Component, PropTypes } from 'react';
import SweetAlert from '../sweetalertFocus';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteServer } from './actions';
import { contactsByClientFindServer, clearContactCreate, clearContactOrder } from '../contact/actions';
import {
    shareholdersByClientFindServer, clearShareholderCreate, clearShareholderOrder
} from '../clients/partners/shareholder/actions';
import { visitByClientFindServer, clearVisitOrder, clearVisitPaginator } from '../visit/actions';
import { pipelineByClientFindServer, clearPipelineOrder, clearPipelinePaginator } from '../pipeline/actions';
import { clearPrevisitOrder, clearPrevisitPaginator, previsitByClientFindServer } from '../previsita/actions';
import {
    clearFilter,
    clearContactsByFunctionPagination,
    clearContactsOrder,
    contactsByFunctionOrTypeFindServer
} from '../contactByFunctionOrType/actions';
import {
    DELETE_AREA_VIEW,
    DELETE_NEED_VIEW,
    DELETE_TYPE_PIPELINE,
    DELETE_TYPE_PREVISIT,
    DELETE_TYPE_VISIT,
    NUMBER_RECORDS,
    DELETE_TYPE_CONTACT,
    DELETE_TYPE_SHAREHOLDER,
    DELETE_PARTICIPANT_VIEW,
    DELETE_TASK_VIEW,
    DELETE_TYPE_BUSINESS_PLAN,
    DELETE_CONTACT_FROM_FUNCTION_OR_TYPE,
    DELETE_GROUP
} from './constants';
import {
    clearBusinessPlanOrder,
    clearBusinessPlanPaginator,
    businessPlanByClientFindServer
} from '../businessPlan/actions';
import { deleteParticipant } from '../participantsVisitPre/actions';
import { deleteTask } from '../visit/tasks/actions';
import { deleteArea } from '../businessPlan/area/actions';
import { deleteNeed } from '../businessPlan/need/actions';
import { draftsDocumentsByUser, clearDraftDocumentOrder, clearDraftDocumentPaginator } from '../myPendings/draftDocuments/actions';
import { clearFilterGroup } from '../contact/favoritesGroup/actions';

class ButtonDeleteComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showEx: false,
            showEr: false
        };
        this._onConfirmDelete = this._onConfirmDelete.bind(this);
        this._confirmDeleteEntity = this._confirmDeleteEntity.bind(this);
        this._closeDelete = this._closeDelete.bind(this);
    }

    _onConfirmDelete(e) {
        const { actionsDelete, deleteServer, participants, tasks, areas, needs } = this.props;
        if (actionsDelete.typeDelete !== DELETE_PARTICIPANT_VIEW && actionsDelete.typeDelete !== DELETE_TASK_VIEW) {
            deleteServer(actionsDelete.urlServer, actionsDelete.json, actionsDelete.typeDelete).then((data) => {
                if ((_.get(data, 'payload.status') === 200)) {
                    this.setState({ showEx: true });
                } else {
                    this.setState({ showEr: true });
                }
            }, () => {
                this.setState({ showEr: true });
            });
        } else {
            var indexDelete;
            if (actionsDelete.typeDelete === DELETE_PARTICIPANT_VIEW) {
                this.setState({ show: false });
                const { deleteParticipant } = this.props;
                if (actionsDelete.tipo === "client" || actionsDelete.tipo === "banco") {
                    indexDelete = participants.findIndex(function (item) {
                        return item.idParticipante === actionsDelete.id;
                    });
                    deleteParticipant(indexDelete);
                } else if (actionsDelete.tipo === "other") {
                    indexDelete = participants.findIndex(function (item) {
                        if (item.tipoParticipante === 'other') {
                            return item.nombreParticipante === actionsDelete.nombre;
                        }
                    });
                    deleteParticipant(indexDelete);
                }
            } else {
                if (actionsDelete.typeDelete === DELETE_TASK_VIEW) {
                    this.setState({ show: false });
                    const { deleteTask } = this.props;
                    indexDelete = tasks.findIndex(function (item) {
                        return item.uuid === actionsDelete.id;
                    });
                    deleteTask(indexDelete);
                } else if (actionsDelete.typeDelete === DELETE_NEED_VIEW) {
                    this.setState({ show: false });
                    const { deleteNeed } = this.props;
                    indexDelete = needs.findIndex(function (item) {
                        return item.uuid === actionsDelete.id;
                    });
                    deleteNeed(indexDelete);
                } else if (actionsDelete.typeDelete === DELETE_AREA_VIEW) {
                    this.setState({ show: false });
                    const { deleteArea } = this.props;
                    indexDelete = areas.findIndex(function (item) {
                        return item.uuid === actionsDelete.id;
                    });
                    deleteArea(indexDelete);
                }
            }
        }
    }

    _closeDelete() {
        const {
            clearPipelineOrder, clearPipelinePaginator, pipelineByClientFindServer, clearPrevisitOrder,
            clearPrevisitPaginator, clearVisitOrder, clearVisitPaginator, previsitByClientFindServer,
            visitByClientFindServer, contactsByClientFindServer, actionsDelete, clearContactCreate, clearContactOrder,
            clearShareholderCreate, clearShareholderOrder, shareholdersByClientFindServer, clearBusinessPlanOrder,
            clearBusinessPlanPaginator, businessPlanByClientFindServer, draftsDocumentsByUser, clearDraftDocumentOrder,
            clearDraftDocumentPaginator, contactsByFunctionOrTypeFindServer, contactsByFunctionOrType, clearContactsByFunctionPagination,
            clearFilterGroup
        } = this.props;
        if (this.state.showEx === true) {
            if (actionsDelete.typeDelete === DELETE_TYPE_CONTACT) {
                clearContactCreate();
                clearContactOrder();
                contactsByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "", 0, "",
                    "",
                    "",
                    "",
                    "");
            } else if (actionsDelete.typeDelete === DELETE_CONTACT_FROM_FUNCTION_OR_TYPE) {
                contactsByFunctionOrTypeFindServer(contactsByFunctionOrType.get('idFunction'), contactsByFunctionOrType.get('idType'), contactsByFunctionOrType.get('idPosition'), contactsByFunctionOrType.get('idDependency'), 1, NUMBER_RECORDS, 0, '');
                clearContactsByFunctionPagination();
            } else if (actionsDelete.typeDelete === DELETE_TYPE_SHAREHOLDER) {
                clearShareholderCreate();
                clearShareholderOrder();
                shareholdersByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "sh.sharePercentage", 1, "", "");
            } else if (actionsDelete.typeDelete === DELETE_TYPE_VISIT) {
                clearVisitOrder();
                clearVisitPaginator();
                visitByClientFindServer(window.sessionStorage.getItem('idClientSelected'), 0, NUMBER_RECORDS, "vd.visitTime", 1, "");
                clearDraftDocumentOrder();
                clearDraftDocumentPaginator();
                draftsDocumentsByUser(0, NUMBER_RECORDS, "", null, "");
            } else if (actionsDelete.typeDelete === DELETE_TYPE_PREVISIT) {
                clearPrevisitOrder();
                clearPrevisitPaginator();
                previsitByClientFindServer(window.sessionStorage.getItem('idClientSelected'), 0, NUMBER_RECORDS, "pvd.visitTime", 1, "");
                clearDraftDocumentOrder();
                clearDraftDocumentPaginator();
                draftsDocumentsByUser(0, NUMBER_RECORDS, "", null, "");
            } else if (actionsDelete.typeDelete === DELETE_TYPE_PIPELINE) {
                clearPipelineOrder();
                clearPipelinePaginator();
                pipelineByClientFindServer(window.sessionStorage.getItem('idClientSelected'), 0, NUMBER_RECORDS, "pe.need", 1, "", "");
                clearDraftDocumentOrder();
                clearDraftDocumentPaginator();
                draftsDocumentsByUser(0, NUMBER_RECORDS, "", null, "");
            } else if (actionsDelete.typeDelete === DELETE_TYPE_BUSINESS_PLAN) {
                clearBusinessPlanOrder();
                clearBusinessPlanPaginator();
                businessPlanByClientFindServer(window.sessionStorage.getItem('idClientSelected'), 0, NUMBER_RECORDS, "initialValidityDate", 1, "", "");
                clearDraftDocumentOrder();
                clearDraftDocumentPaginator();
                draftsDocumentsByUser(0, NUMBER_RECORDS, "", null, "");
            } else if (actionsDelete.typeDelete == DELETE_GROUP) {
                clearFilterGroup();
            }
        }
        this.setState({ showEx: false, showEr: false, show: false });
    }

    _confirmDeleteEntity(e) {
        e.preventDefault();
        this.setState({ show: true });
    }

    render() {
        const { actionsDelete } = this.props;
        return (
            <td style={{ padding: '10px', textAlign: 'center' }}>
                <button onClick={this._confirmDeleteEntity} className="btn btn-sm  btn-danger">
                    <i style={{ margin: '0em', fontSize: '1.2em' }} className="trash icon"></i>
                </button>
                <SweetAlert
                    type="warning"
                    show={this.state.show}
                    title="Confirmar eliminación"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    text={actionsDelete.mensaje}
                    showCancelButton={true}
                    onCancel={() => this.setState({ show: false })}
                    onConfirm={() => this._onConfirmDelete()} />
                <SweetAlert
                    type="success"
                    show={this.state.showEx}
                    title="Eliminado"
                    onConfirm={() => this._closeDelete()}
                />
                <SweetAlert
                    type="error"
                    show={this.state.showEr}
                    title="Error"
                    text="Señor usuario, se presento un error al realizar la eliminación."
                    onConfirm={() => this._closeDelete()}
                />
            </td>);
    }
}

ButtonDeleteComponent.propTypes = {
    actionsDelete: PropTypes.object
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteServer,
        contactsByClientFindServer,
        clearContactCreate,
        shareholdersByClientFindServer,
        clearShareholderCreate,
        clearShareholderOrder,
        clearContactOrder,
        visitByClientFindServer,
        previsitByClientFindServer,
        pipelineByClientFindServer,
        clearVisitOrder,
        clearVisitPaginator,
        clearPrevisitOrder,
        clearPrevisitPaginator,
        clearPipelineOrder,
        clearPipelinePaginator,
        clearBusinessPlanOrder,
        clearBusinessPlanPaginator,
        businessPlanByClientFindServer,
        deleteParticipant,
        deleteTask,
        deleteNeed,
        deleteArea,
        draftsDocumentsByUser,
        clearDraftDocumentOrder,
        clearDraftDocumentPaginator,
        clearFilter,
        clearContactsByFunctionPagination,
        clearContactsOrder,
        contactsByFunctionOrTypeFindServer,
        clearFilterGroup
    }, dispatch);
}

function mapStateToProps({ deleteGridReducer, participants, tasks, needs, areas, contactsByFunctionOrType }) {
    return {
        deleteGridReducer,
        participants,
        tasks,
        needs,
        areas,
        contactsByFunctionOrType
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDeleteComponent);
