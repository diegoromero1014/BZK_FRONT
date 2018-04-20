import React, { Component } from "react";
import { Col, Row } from "react-flexbox-grid";
import { reduxForm } from "redux-form";
import Input from "../../ui/input/inputComponent";
import Textarea from "../../ui/textarea/textareaComponent";

import SweetAlert from "sweetalert-react";
import { swtShowMessage } from "../sweetAlertMessages/actions";

import { MESSAGE_LOAD_DATA, MODULE_RISK_GROUP, VALUE_REQUIERED, VALUE_XSS_INVALID } from "../../constantsGlobal";
import {
    formValidateKeyEnter,
    nonValidateEnter,
    validatePermissionsByModule,
    validateResponse,xssValidation
} from "../../actionsGlobal";
import { bindActionCreators } from "redux";
import { editNameRiskGroup, getClientsRiskGroup, updateValuesRiskGroup, getAllNoveltiesRiskGroup } from "./actions";
import ModalComponentDeleteRiskGroup from "./modalComponentDeleteRiskGroup";
import ModalComponentMemberRiskGroup from "./modalComponentMemberRiskGroup";
import ClientsRiskGroup from "./clientsRiskGroup";
import { showLoading } from "../loading/actions";
import Modal from "react-modal";
import { Menu, Segment } from 'semantic-ui-react'
import { OPTION_RISK_GROUP, OPTION_NOVELTY } from './constants';
import ListNoveltiesRiskGroup from "./ListNoveltiesRiskGroup";


import _ from "lodash";


export const EDITAR = "Editar";
export const ELIMINAR = "Eliminar";

const fields = ["groupName", "groupObservations"]

const numberThumbsRow = 3;

const validate = values => {
    const errors = {};

    if (!values.groupName) {
        errors.groupName = VALUE_REQUIERED;
    } else if (xssValidation(values.groupName)) {
        errors.groupName = VALUE_XSS_INVALID;
    }else {
        errors.groupName = null;
    }

    if (!values.groupObservations) {
        errors.groupObservations = VALUE_REQUIERED;
    } else if (xssValidation(values.groupObservations)) {
        errors.groupObservations = VALUE_XSS_INVALID;
    } else {
        errors.groupObservations = null;
    }

    return errors;
};

let thisForm;
class ModalComponentRiskGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showError: false,
            showErrorForm: false,
            allowEditGroup: false,
            modalDelteRiskGroupIsOpen: false,
            modalMemberIsOpen: false,
            tabActive: OPTION_RISK_GROUP
        };

        this.openModalDelteRiskGroup = this.openModalDelteRiskGroup.bind(this);
        this.closeModalDelteRiskGroup = this.closeModalDelteRiskGroup.bind(this);
        this.openModalMember = this.openModalMember.bind(this);
        this.closeModalMember = this.closeModalMember.bind(this);
        this.updateRiskGroup = this.updateRiskGroup.bind(this);

        this._handlerSubmitGroup = this._handlerSubmitGroup.bind(this);
        this._closeError = this._closeError.bind(this);
        this._mapClientItems = this._mapClientItems.bind(this);
        thisForm = this;
    }


    openModalDelteRiskGroup() {
        const { validateHasRiskGroup } = this.props;
        validateHasRiskGroup(() => {
        });

        this.setState({ modalDelteRiskGroupIsOpen: true });
    }

    closeModalDelteRiskGroup() {
        this.setState({ modalDelteRiskGroupIsOpen: false });
    }

    openModalMember() {
        const { validateHasRiskGroup } = this.props;
        validateHasRiskGroup(() => {
        });

        this.setState({ modalMemberIsOpen: true });
    }

    closeModalMember() {
        this.setState({ modalMemberIsOpen: false });
    }

    _closeError() {
        this.setState({ showError: false, messageError: '' });
    }

    componentWillMount() {
        const {
            fields: { groupName }, getClientsRiskGroup, clientInformacion,
            nonValidateEnter, showLoading, isOpen, swtShowMessage, validateHasRiskGroup
        } = this.props;
        const { validatePermissionsByModule, getAllNoveltiesRiskGroup } = this.props;


        validatePermissionsByModule(MODULE_RISK_GROUP);

        const infoClient = clientInformacion.get('responseClientInfo');

        nonValidateEnter(true);
        showLoading(true, MESSAGE_LOAD_DATA);

        this.setState({ allowEditGroup: false });
        validateHasRiskGroup(() => {
            getClientsRiskGroup(infoClient.id).then((data) => {
                if (validateResponse(data)) {
                    let riskGroup = _.get(data, 'payload.data.data');
                    getAllNoveltiesRiskGroup(riskGroup.id);
                    groupName.onChange(riskGroup.name);
                    if (riskGroup.isPending != null && riskGroup.isPending) {
                        swtShowMessage('warning', 'Grupo de riesgo pendiente', 'Señor usuario, el grupo de riesgo se encuentra pendiente de aprobar eliminación por parte del analista de riegos.');
                    }
                } else {
                    swtShowMessage('error', 'Error consultado grupo de riesgo', 'Señor usuario, ocurrió un error tratando de consultar el grupo de riesgo.');
                    isOpen();
                }

                showLoading(false, "");
            });
        });
    }

    _mapClientItems(data, index) {
        const { validateHasRiskGroup, riskGroupReducer } = this.props;
        const riskGroup = riskGroupReducer.get('riskGroupClients');
        const isPending = _.get(riskGroup, 'isPending', true);

        let coord_position = index / numberThumbsRow;
        let trunc_a = Math.trunc(coord_position);
        let row_number = trunc_a + 1;
        let trunc_b =  Math.trunc((coord_position - trunc_a ) * 10);
        let column_number = trunc_b / numberThumbsRow;        

        return <ClientsRiskGroup
            gridRow={row_number}
            gridColumn={column_number}
            key={data.id}
            dataName={data.clientName}
            dataDocumentType={data.documentType}
            dataDocument={data.documentNumber}
            client={data}
            validateHasRiskGroup={validateHasRiskGroup}
            isPending={isPending}
        />
    }

    updateRiskGroup() {
        const { updateValuesRiskGroup, riskGroupReducer, fields: { groupName, groupObservations }, clientInformacion, editNameRiskGroup, swtShowMessage } = this.props;

        const infoClient = clientInformacion.get('responseClientInfo');

        const riskGroup = riskGroupReducer.get('riskGroupClients');

        const jsonUpdateGroup = {
            id: riskGroup.id,
            name: groupName.value !== undefined ? groupName.value.trim() : null,
            code: riskGroup.code,
            observation: groupObservations.value !== undefined ? groupObservations.value : null
        };
        const self = this;
        editNameRiskGroup(jsonUpdateGroup).then((data2) => {
            if (validateResponse(data2)) {
                swtShowMessage('success', 'Edición grupo de riesgo', 'Señor usuario, el grupo de riesgo fue editado exitosamente. Recuerde que el cambio esta sujeto a rechazo por parte del analista de riesgo');
                getClientsRiskGroup(infoClient.id);
                groupObservations.onChange("");
                updateValuesRiskGroup(jsonUpdateGroup);
                self.setState({
                    showError: false,
                    showErrorForm: false,
                    allowEditGroup: false
                });
            } else {
                swtShowMessage('error', 'Error editando grupo de riesgo', 'Señor usuario, ocurrió un error tratando de editar el grupo de riesgo.');
            }
        }, (reason) => {
            swtShowMessage('error', 'Error editando grupo de riesgo', 'Señor usuario, ocurrió un error editando el grupo de riesgo.');
        })
    }
    handleItemClick = (e, { name }) => this.setState({ tabActive: name });
    _handlerSubmitGroup() {
        const { validateHasRiskGroup } = this.props;
        validateHasRiskGroup(() => {
            this.updateRiskGroup()
        });
    }

    render() {
        const { tabActive } = this.state;
        const {
            fields: { groupName, groupObservations }, validateHasRiskGroup,
            riskGroupReducer, clientInformacion, handleSubmit, reducerGlobal
        } = this.props;

        const riskGroup = riskGroupReducer.get('riskGroupClients');

        const infoClient = clientInformacion.get('responseClientInfo');
        const isPending = _.get(riskGroup, 'isPending', true);

        const allowEdit = _.get(reducerGlobal.get('permissionsRiskGroup'), _.indexOf(reducerGlobal.get('permissionsRiskGroup'), EDITAR), false);
        const allowDelete = _.get(reducerGlobal.get('permissionsRiskGroup'), _.indexOf(reducerGlobal.get('permissionsRiskGroup'), ELIMINAR), false);

        const _riskGroup = Object.assign({}, riskGroup);
        const members = Object.assign([], _riskGroup.members);
        return (
            <div id="content-modal-rosk-group"
                className="modalBt4-body modal-body business-content editable-form-content clearfix"
                style={{ overflowX: "hidden", marginBottom: '15px' }}>

                <Row style={{ padding: "15px" }}>
                    <Col xs>
                        <Menu attached='top' tabular>
                            <Menu.Item name={OPTION_RISK_GROUP} active={tabActive === OPTION_RISK_GROUP} onClick={this.handleItemClick} />
                            <Menu.Item name={OPTION_NOVELTY} active={tabActive === OPTION_NOVELTY} onClick={this.handleItemClick} />
                        </Menu>
                        <Segment>
                            {tabActive === OPTION_RISK_GROUP &&
                                <div className="horizontal-scroll-wrapper" style={{ overflow: 'hidden', background: '#fff' }}>
                                    <div className="news-page content">
                                        <div className="team-modal">
                                            <form onSubmit={handleSubmit(this._handlerSubmitGroup)}
                                                onKeyPress={val => formValidateKeyEnter(val, true)} style={{ width: "100%" }}>
                                                <Row style={{ padding: "10px 20px 20px 20px" }}>
                                                    <Col xs={12} md={6} lg={this.state.allowEditGroup ? 12 : 8}>
                                                        <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                                                            <dt><span>Nombre del grupo </span>
                                                                {this.state.allowEditGroup && <span>(<span style={{ color: "red" }}>*</span>)</span>}
                                                            </dt>
                                                            {!this.state.allowEditGroup &&
                                                                <p style={{ wordBreak: "break-word" }}>{riskGroup ? riskGroup.name : ""}</p>
                                                            }
                                                            {this.state.allowEditGroup &&
                                                                <Input name="groupName"
                                                                    type="text"
                                                                    max="60"
                                                                    {...groupName}
                                                                />
                                                            }
                                                        </div>
                                                    </Col>

                                                    {this.state.allowEditGroup &&
                                                        <Col md={12}>

                                                            <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                                                                <dt><span>Observaciones </span>
                                                                    <span>(<span style={{ color: "red" }}>*</span>)</span>
                                                                </dt>
                                                                <Textarea className="form-control need-input"
                                                                    {...groupObservations}
                                                                    name="groupObservations"
                                                                    maxLength="250"
                                                                />
                                                            </div>
                                                        </Col>
                                                    }

                                                    <Col xs={2} md={4} lg={this.state.allowEditGroup ? 12 : 4} style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "flex-end",
                                                        marginTop: "10px"
                                                    }}>
                                                        {this.state.allowEditGroup && allowEdit && infoClient.haveAccessEdit &&
                                                            <div>
                                                                <button className="btn btn-primary" type="submit" style={{ cursor: 'pointer' }}>
                                                                    Guardar
                                                                </button>
                                                                <button className="btn btn-default" type="button"
                                                                    onClick={() => this.setState({ allowEditGroup: !this.state.allowEditGroup })}
                                                                    style={{ cursor: 'pointer', marginLeft: "10px", backgroundColor: "#66778d" }}> Cancelar
                                                                </button>
                                                            </div>
                                                        }
                                                        {!this.state.allowEditGroup && allowEdit && infoClient.haveAccessEdit && !isPending &&
                                                            <div>
                                                                <button className="btn btn-primary" type="button"
                                                                    onClick={() => this.setState({ allowEditGroup: !this.state.allowEditGroup })}
                                                                    style={{ cursor: 'pointer' }}>
                                                                    Editar
                                                                </button>
                                                            </div>
                                                        }
                                                        {allowDelete && infoClient.haveAccessEdit && !isPending &&
                                                            <button className="btn btn-danger" type="button" onClick={this.openModalDelteRiskGroup}
                                                                style={{ cursor: 'pointer', marginLeft: "10px" }}>
                                                                Eliminar </button>
                                                        }


                                                        <Modal isOpen={this.state.modalDelteRiskGroupIsOpen}
                                                            onRequestClose={this.closeModalDelteRiskGroup}
                                                            className="modalBt4-fade modal fade contact-detail-modal in">
                                                            <div className="modalBt4-dialog modalBt4-md">
                                                                <div className="modalBt4-content modal-content">
                                                                    <div className="modalBt4-header modal-header">
                                                                        <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }}
                                                                            id="myModalLabel">Eliminar grupo de riesgo</h4>
                                                                        <button type="button" onClick={this.closeModalDelteRiskGroup}
                                                                            className="close" data-dismiss="modal" role="close">
                                                                            <span className="modal-title" aria-hidden="true" role="close"><i
                                                                                className="remove icon modal-icon-close" role="close"></i></span>
                                                                            <span className="sr-only">Close</span>
                                                                        </button>
                                                                    </div>
                                                                    {<ModalComponentDeleteRiskGroup validateHasRiskGroup={validateHasRiskGroup}
                                                                        riskGroup={riskGroup}
                                                                        isOpen={this.closeModalDelteRiskGroup} />}
                                                                </div>
                                                            </div>
                                                        </Modal>


                                                    </Col>

                                                    <SweetAlert
                                                        type="error"
                                                        show={this.state.showErrorForm}
                                                        title="Campos obligatorios"
                                                        text="Señor usuario, para editar un grupo de riesgo debe ingresar los campos obligatorios."
                                                        onConfirm={() => this.setState({ showErrorForm: false })}
                                                    />
                                                </Row>
                                            </form>

                                            <hr style={{ width: "100%", height: "1px", margin: "0px" }} />
                                            <Row style={{ padding: "10px 20px 20px 20px" }}>
                                                <Col lg={12} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                                    {!isPending &&
                                                        <button className="btn btn-primary" type="button" onClick={this.openModalMember}
                                                            style={{ cursor: 'pointer', marginLeft: "20px" }}>
                                                            Agregar cliente
                                                        </button>}
                                                    <Modal isOpen={this.state.modalMemberIsOpen} onRequestClose={this.closeModalMember}
                                                        className="modalBt4-fade modal fade contact-detail-modal in">
                                                        <div className="modalBt4-dialog modalBt4-lg">
                                                            <div className="modalBt4-content modal-content">
                                                                <div className="modalBt4-header modal-header">
                                                                    <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }}
                                                                        id="myModalLabel">Agregar cliente</h4>
                                                                    <button type="button" onClick={this.closeModalMember} className="close"
                                                                        data-dismiss="modal" role="close">
                                                                        <span className="modal-title" aria-hidden="true" role="close"><i
                                                                            className="remove icon modal-icon-close" role="close"></i></span>
                                                                        <span className="sr-only">Close</span>
                                                                    </button>
                                                                </div>
                                                                {<ModalComponentMemberRiskGroup validateHasRiskGroup={validateHasRiskGroup}
                                                                    riskGroup={riskGroup}
                                                                    isOpen={this.closeModalMember} />}
                                                            </div>
                                                        </div>
                                                    </Modal>

                                                </Col>

                                                <div className="team-modal grid c-3 " >
                                                    {members.length === 0 ?
                                                        <div style={{ textAlign: "center", marginTop: "15px" }}><h4 className="form-item">Señor
                                                            usuario, no hay clientes asociados a este grupo de riesgo.</h4></div>
                                                        :
                                                        members.map(this._mapClientItems)}
                                                </div>

                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            }
                            {tabActive === OPTION_NOVELTY &&
                                <div className="horizontal-scroll-wrapper" style={{ overflow: 'hidden', background: '#fff' }}>
                                    <div className="news-page content">
                                        <div className="team-modal">
                                            <ListNoveltiesRiskGroup riskGroupReducer={riskGroupReducer} />
                                        </div>
                                    </div>
                                </div>
                            }

                        </Segment>
                    </Col>

                </Row>
            </div >
        )
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getClientsRiskGroup,
        nonValidateEnter,
        showLoading,
        editNameRiskGroup,
        swtShowMessage,
        validatePermissionsByModule,
        updateValuesRiskGroup,
        getAllNoveltiesRiskGroup
    }, dispatch);
}

function mapStateToProps({ riskGroupReducer, clientInformacion, reducerGlobal }, ownerProps) {
    return {
        riskGroupReducer,
        clientInformacion,
        reducerGlobal
    };
}

export default reduxForm({
    form: 'submitGroupEdit',
    fields,
    destroyOnUnmount: true,
    validate,
    onSubmitFail: errors => {
        thisForm.setState({ showErrorForm: true });
    }
}, mapStateToProps, mapDispatchToProps)(ModalComponentRiskGroup);
