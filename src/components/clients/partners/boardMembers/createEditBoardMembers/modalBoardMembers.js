import moment from "moment";
import { reduxForm } from "redux-form";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { Col, Row } from "react-flexbox-grid";
import momentLocalizer from "react-widgets/lib/localizers/moment";
import _ from "lodash";
import ComboBox from "../../../../../ui/comboBox/comboBoxComponent";
import InputComponent from "../../../../../ui/input/inputComponent";
import Textarea from "../../../../../ui/textarea/textareaComponent";
import ToolTip from "../../../../toolTip/toolTipComponent";
import SweetAlert from '../../../../sweetalertFocus';
import { fields, validations as validate } from './fieldsAndRulesForReduxForm';
import { checkNumberDocument, checkFirstCharacter } from './../../../../../validationsFields/rulesField';
import { getClientNeeds, getMasterDataFields } from "../../../../selectsComponent/actions";
import { changeKeyword, clearFilters, getBoardMembers, saveBoardMember, validateExistsBoardMember } from "../actions";
import { changeStateSaveData } from "../../../../main/actions";
import { stringValidate, validateResponse } from "../../../../../actionsGlobal";
import { swtShowMessage } from "../../../../sweetAlertMessages/actions";
import { CONTACT_ID_TYPE } from "../../../../selectsComponent/constants";
import {
    LOWER_INITIAL_LIMIT,
    NUMBER_RECORDS,
    TITLE_TOOLTIP_BOARD_MEMBERS,
    TITLE_TOOLTIP_TEXT_AREA_BOARD_MEMBERS
} from "../constants";
import {
    EDITAR,
    MESSAGE_ERROR_SWEET_ALERT,
    MESSAGE_LOAD_DATA,
    TITLE_ERROR_SWEET_ALERT,
    REGEX_SIMPLE_XSS_MESAGE
} from "../../../../../constantsGlobal";

function GetBtnAllowEditOrBtnSearchExists(props) {
    if (!props.thisSelf.state.allowsEditingOFDocument) {
        return <div />
    } else {
        if (_.isUndefined(props.boardMember)) {
            return <Col xs>
                <dl style={{ width: '100%' }}>
                    <button type="button" className="btn btn-primary"
                        style={{ marginTop: '35px' }}
                        onClick={props.thisSelf._validateExistBoardMember}>
                        <i style={{ color: "white", margin: '0em', fontSize: '1.2em' }}
                            className="search icon" />
                    </button>
                </dl>
            </Col>
        } else {
            if (_.get(props.reducerGlobal.get('permissionsBoardMembers'), _.indexOf(props.reducerGlobal.get('permissionsBoardMembers'), EDITAR), false)) {
                return <Col xs>
                    <dl style={{ width: '100%' }}>
                        <button type="button" onClick={props.thisSelf._editBoardMember}
                            className={'btn btn-primary modal-button-edit'}
                            style={{ marginTop: '35px' }}>
                            Editar
                            <i className={'icon edit'} style={{ marginLeft: '5px' }}></i>
                        </button>
                    </dl>
                </Col>
            } else {
                return <div />
            }
        }
    }
}

let fechaModString = '', fechaCreateString = '', createdBy = '', updatedBy = '';
let showAuditFields = false;

class ModalCreateBoardMembers extends Component {

    constructor(props) {
        super(props);
        this._handleBoardMember = this._handleBoardMember.bind(this);
        this._validateExistBoardMember = this._validateExistBoardMember.bind(this);
        this._editBoardMember = this._editBoardMember.bind(this);
        this._sendAuditInformation = this._sendAuditInformation.bind(this);
        this._onClickClear = this._onClickClear.bind(this);
        this.state = {
            //controla si se muestra el formulario completo, valores (hidden, visible)
            showCompleteForm: 'hidden',
            //controla si se puede editar la información del miembro de junta, valores (true, false)
            isEditable: false,
            //controla si puede editar los campos de tipo de documento y número de documento
            allowsEditingOFDocument: true,
            showErrorXss: false,
        }
        momentLocalizer(moment);
    }

    /**
     * Reinicia el formulario para realizar de nuevo la búsqueda de un miembro de junta
     */
    _onClickClear() {
        this.setState({
            showCompleteForm: 'hidden',
            allowsEditingOFDocument: true
        });
        this.props.resetForm();
    }

    /**
     * Habilita todos los campos del formulario para permitir editar
     */
    _editBoardMember() {
        this.setState({
            isEditable: !this.state.isEditable
        });
    }

    /**
     * Se ejecuta cuando se da clic en el botón guardar, valida si es para crear o actualizar
     * un miembro de junta
     */
    _handleBoardMember() {
        const {
            fields: {
                idBoardMember, typeOfDocument, numberDocument, firstName, middleName,
                firstLastName, secondLastName, observations
            }, saveBoardMember, swtShowMessage, changeStateSaveData, changeKeyword,
            clearFilters, isOpen, getBoardMembers
        } = this.props;

        var boardMember = {
            idClientBoardMember: null,
            idClient: window.sessionStorage.getItem('idClientSelected'),
            idBoardMember: idBoardMember.value,
            idTypeOfDocument: typeOfDocument.value,
            numberDocument: (numberDocument.value).trim(),
            firstName: firstName.value,
            middleName: middleName.value,
            firstLastName: firstLastName.value,
            secondLastName: secondLastName.value,
            observations: observations.value
        };

        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        saveBoardMember(boardMember).then((data) => {
            changeStateSaveData(false, "");
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            } else {
                if (data.payload.data.data) {
                    clearFilters();
                    changeKeyword('');
                    getBoardMembers(window.sessionStorage.getItem('idClientSelected'), LOWER_INITIAL_LIMIT, NUMBER_RECORDS, '').then((data) => {
                        if (!validateResponse(data)) {
                            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                        }
                    }, (reason) => {
                        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                    });
                    swtShowMessage('success', 'Miembro de junta', 'Señor usuario, el miembro de junta se ha guardado exitosamente');
                    isOpen();
                } else {
                    swtShowMessage('error', 'Información inválida', 'Señor usuario, ya existe un miembro de junta con ese tipo de documento y número de documento');
                }
            }
        }, (reason) => {
            changeStateSaveData(false, "");
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    /**
     * Llama un servicio que valida si el miembro de junta ya existe, si existe, carga la información,
     * en cualquier caso muestra el resto del formulario para permitir el registro
     */
    _validateExistBoardMember() {
        const {
            fields: {
                idBoardMember, typeOfDocument, numberDocument, firstName, middleName,
                firstLastName, secondLastName, observations
            }, validateExistsBoardMember, swtShowMessage,
            changeStateSaveData
        } = this.props;

        if (stringValidate(typeOfDocument.value) && stringValidate(numberDocument.value)) {
            if (!_.isNull(checkNumberDocument(numberDocument.value)) ||
                !_.isNull(checkFirstCharacter(numberDocument.value))) {

                return;
            }

            var jsonBoardMember = {
                idTypeDocument: typeOfDocument.value,
                numberDocument: (numberDocument.value).trim(),
                idClient: window.sessionStorage.getItem('idClientSelected')
            };

            changeStateSaveData(true, MESSAGE_LOAD_DATA);
            validateExistsBoardMember(jsonBoardMember).then((data) => {
                changeStateSaveData(false, "");
                if (!validateResponse(data)) {
                    swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                } else {
                    var allowShowCompleteForm = false, cleanFieldsBoardMember = false;
                    const detailBoardMember = _.get(data, 'payload.data.data', null);
                    if (detailBoardMember != null) {
                        if (_.get(detailBoardMember, 'idClientBoardMember', null) !== null) {
                            swtShowMessage('warning', 'Relación existente', 'Señor usuario, el miembro de junta ya presenta una relación con el cliente');
                            cleanFieldsBoardMember = true;
                            showAuditFields = false;
                        } else {
                            idBoardMember.onChange(detailBoardMember.idBoardMember);
                            typeOfDocument.onChange(detailBoardMember.idTypeOfDocument);
                            numberDocument.onChange(detailBoardMember.numberDocument);
                            firstName.onChange(detailBoardMember.firstName);
                            middleName.onChange(detailBoardMember.middleName);
                            firstLastName.onChange(detailBoardMember.firstLastName);
                            secondLastName.onChange(detailBoardMember.secondLastName);
                            observations.onChange(detailBoardMember.observations);
                            allowShowCompleteForm = true;
                            showAuditFields = true;
                            this._sendAuditInformation(false, detailBoardMember.userNameCreate, detailBoardMember.userNameUpdate, detailBoardMember.dateUpdate, detailBoardMember.dateCreate);
                        }
                    } else {
                        allowShowCompleteForm = true;
                        cleanFieldsBoardMember = true;
                        showAuditFields = false;
                        this._sendAuditInformation(true, null, null, null, null);
                    }

                    if (cleanFieldsBoardMember) {
                        idBoardMember.onChange('');
                        firstName.onChange('');
                        middleName.onChange('');
                        firstLastName.onChange('');
                        secondLastName.onChange('');
                        observations.onChange('');
                    }
                    
                    if (allowShowCompleteForm) {
                        this.setState({
                            showCompleteForm: 'visible',
                            allowsEditingOFDocument: false
                        });
                    } else {
                        this.setState({
                            showCompleteForm: 'hidden'
                        });
                    }
                }
            }, (reason) => {
                changeStateSaveData(false, "");
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            });
        } else {
            swtShowMessage('error', 'Información faltante', 'Señor usuario, debe ingresar el tipo de documento y número de documento para realizar la búsqueda');
        }
    }

    /**
     * Recibe la información de auditoría del miembro de junta, la procesa y guarda en
     * las variables que se usan en la vista
     * @param {*} userNameCreate
     * @param {*} userNameUpdate
     * @param {*} dateUpdate
     * @param {*} dateCreate
     */
    _sendAuditInformation(cleanFields, userNameCreate, userNameUpdate, dateUpdate, dateCreate) {
        if (cleanFields) {
            createdBy = '';
            updatedBy = '';
            fechaModString = '';
            fechaCreateString = '';
        } else {
            createdBy = userNameCreate;
            updatedBy = userNameUpdate;
            if (dateUpdate !== null) {
                let fechaModDateMoment = moment(dateUpdate, "x").locale('es');
                fechaModString = fechaModDateMoment.format("DD") + " " + fechaModDateMoment.format("MMM") + " " + fechaModDateMoment.format("YYYY") + ", " + fechaModDateMoment.format("hh:mm a");
            }
            if (dateCreate !== null) {
                let fechaCreateDateMoment = moment(dateCreate, "x").locale('es');
                fechaCreateString = fechaCreateDateMoment.format("DD") + " " + fechaCreateDateMoment.format("MMM") + " " + fechaCreateDateMoment.format("YYYY") + ", " + fechaCreateDateMoment.format("hh:mm a");
            }
        }
    }

    componentWillMount() {
        const { boardMember } = this.props;
        if (!_.isUndefined(boardMember)) {
            showAuditFields = true;
            this._sendAuditInformation(false, boardMember.userNameCreate, boardMember.userNameUpdate, boardMember.dateUpdate, boardMember.dateCreate);
            this.setState({
                showCompleteForm: 'visible',
                isEditable: false
            });
        } else {
            this.setState({
                isEditable: true
            });
        }
    }

    render() {
        const {
            fields: {
                typeOfDocument, numberDocument, firstName, middleName, firstLastName, secondLastName, observations
            },
            isOpen, handleSubmit, boardMember, reducerGlobal, selectsReducer
        } = this.props;

        return (
            <form onSubmit={handleSubmit(this._handleBoardMember)}>
                <div className="modalBt4-body modal-body business-content editable-form-content clearfix"
                    id="modalCreateBoardMembers">
                    <div style={{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '30px' }}>
                        <p style={{ paddingTop: "10px", marginBottom: "0px" }}>
                            Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.
                        </p>
                        <Row>
                            <Col xs>
                                <dt><span>Tipo de documento (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <dt style={{ paddingTop: "0px" }}>
                                    <ComboBox
                                        name="typeOfDocument"
                                        {...typeOfDocument}
                                        defaultValue={typeOfDocument.value}
                                        labelInput="Seleccione..."
                                        valueProp={'id'}
                                        textProp={'value'}
                                        disabled={this.state.isEditable && this.state.allowsEditingOFDocument ? '' : 'disabled'}
                                        data={selectsReducer.get(CONTACT_ID_TYPE) || []}
                                    />
                                </dt>
                            </Col>
                            <Col xs>
                                <dt><span>Número de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                                <InputComponent
                                    name="numberDocument"
                                    type="text"
                                    max="30"
                                    {...numberDocument}
                                    disabled={this.state.isEditable && this.state.allowsEditingOFDocument ? '' : 'disabled'}
                                />
                            </Col>
                            <GetBtnAllowEditOrBtnSearchExists thisSelf={this} boardMember={boardMember}
                                reducerGlobal={reducerGlobal} />
                        </Row>
                        <Row style={{ visibility: this.state.showCompleteForm }}>
                            <Col xs>
                                <dt><span>Primer nombre (</span><span style={{ color: "red" }}>*</span>)</dt>
                                <InputComponent
                                    name="firstName"
                                    type="text"
                                    max="60"
                                    {...firstName}
                                    disabled={this.state.isEditable ? '' : 'disabled'}
                                />
                            </Col>
                            <Col xs>
                                <dt><span>Segundo nombre </span></dt>
                                <InputComponent
                                    name="middleName"
                                    type="text"
                                    max="60"
                                    {...middleName}
                                    disabled={this.state.isEditable ? '' : 'disabled'}
                                />
                            </Col>
                        </Row>
                        <Row style={{ visibility: this.state.showCompleteForm }}>
                            <Col xs>
                                <dt><span>Primer apellido (</span><span style={{ color: "red" }}>*</span>)</dt>
                                <InputComponent
                                    name="firstLastName"
                                    type="text"
                                    max="60"
                                    {...firstLastName}
                                    disabled={this.state.isEditable ? '' : 'disabled'}
                                />
                            </Col>
                            <Col xs>
                                <dt><span>Segundo apellido </span></dt>
                                <InputComponent
                                    name="<secondLastName></secondLastName>"
                                    type="text"
                                    max="60"
                                    {...secondLastName}
                                    disabled={this.state.isEditable ? '' : 'disabled'}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <dt style={{ visibility: this.state.showCompleteForm }}>
                                <div style={{ width: "100%", float: "left" }}>
                                    <span style={{ marginLeft: "6px" }}>Observaciones</span>
                                    <ToolTip text={TITLE_TOOLTIP_BOARD_MEMBERS}>
                                        <i className="help circle icon blue"
                                            style={{ fontSize: "18px", cursor: "pointer", marginLeft: "5px" }} />
                                    </ToolTip>
                                </div>
                            </dt>
                        </Row>
                        <Row>
                            <Col xs style={{ visibility: this.state.showCompleteForm }}>
                                <Textarea
                                    name="observations"
                                    type="text"
                                    max="1000"
                                    title={TITLE_TOOLTIP_TEXT_AREA_BOARD_MEMBERS}
                                    style={{ width: '100%', height: '130px' }}
                                    {...observations}
                                    disabled={this.state.isEditable ? '' : 'disabled'}
                                />
                            </Col>
                        </Row>
                        {showAuditFields &&
                            < Row style={{ padding: "20px 10px 0px 0px", visibility: this.state.showCompleteForm }}>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{ fontWeight: "bold", color: "#818282" }}>Creado por</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha de creación</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy !== null &&
                                        <span style={{ fontWeight: "bold", color: "#818282" }}>Modificado por</span>
                                    }
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy !== null &&
                                        <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha de modificación</span>
                                    }
                                </Col>
                            </Row>
                        }
                        {showAuditFields &&
                            <Row style={{ padding: "5px 10px 0px    0px", visibility: this.state.showCompleteForm }}>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{ marginLeft: "0px", color: "#818282" }}>{createdBy}</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{ marginLeft: "0px", color: "#818282" }}>{fechaCreateString}</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy !== null &&
                                        <span style={{ marginLeft: "0px", color: "#818282" }}>{updatedBy}</span>
                                    }
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy !== null &&
                                        <span style={{ marginLeft: "0px", color: "#818282" }}>{fechaModString}</span>
                                    }
                                </Col>
                            </Row>
                        }
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="submit" className="btn btn-primary modal-button-edit"
                        style={{ visibility: this.state.showCompleteForm }}
                        disabled={this.state.isEditable ? '' : 'disabled'}>
                        <span>Guardar</span>
                    </button>
                    <button className="modal-button-edit btn btn-default btnDefaultAyax"
                        onClick={() => {
                            isOpen()
                        }}>
                        <span>Cancelar</span>
                    </button>
                </div>
                <SweetAlert
                    type="error"
                    show={this.state.showErrorXss}
                    title="Campos obligatorios"
                    text={REGEX_SIMPLE_XSS_MESAGE}
                    onConfirm={() => this.setState({ showErrorXss: false })}
                />
            </form >
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getClientNeeds,
        getMasterDataFields,
        validateExistsBoardMember,
        swtShowMessage,
        saveBoardMember,
        getBoardMembers,
        changeStateSaveData,
        clearFilters,
        changeKeyword
    }, dispatch);
}

function mapStateToProps({ selectsReducer, reducerGlobal, boardMembersReducer }, { boardMember }) {
    if (!_.isUndefined(boardMember)) {
        return {
            selectsReducer,
            reducerGlobal,
            boardMembersReducer,
            initialValues: {
                idBoardMember: boardMember.idBoardMember,
                typeOfDocument: boardMember.idTypeOfDocument,
                numberDocument: boardMember.numberDocument,
                firstName: boardMember.firstName,
                middleName: boardMember.middleName,
                firstLastName: boardMember.firstLastName,
                secondLastName: boardMember.secondLastName,
                observations: boardMember.observations
            }
        }
    } else {
        return {
            selectsReducer,
            reducerGlobal,
            boardMembersReducer,
            initialValues: {
                idBoardMember: null,
                typeOfDocument: null,
                numberDocument: null,
                firstName: null,
                middleName: null,
                firstLastName: null,
                secondLastName: null,
                observations: null
            }
        };
    }
}

export default reduxForm({
    form: 'submitCreateBoardMembers',
    fields,
    destroyOnUnmount: true,
    validate
}, mapStateToProps, mapDispatchToProps)(ModalCreateBoardMembers);