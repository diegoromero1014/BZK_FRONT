import moment from "moment";
import { reduxForm } from "redux-form";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import SweetAlert from "sweetalert-react";
import { Col, Row } from "react-flexbox-grid";
import momentLocalizer from "react-widgets/lib/localizers/moment";
import ComboBox from "../../../../../ui/comboBox/comboBoxComponent";
import InputComponent from '../../../../../ui/input/inputComponent';
import ComboBoxFilter from "../../../../../ui/comboBoxFilter/comboBoxFilter";
import { getClientNeeds, getMasterDataFields } from "../../../../selectsComponent/actions";
import { CONTACT_ID_TYPE } from "../../../../selectsComponent/constants";
import { SAVE, FIRST_PAGE, NUMBER_RECORDS } from "../constants";
import {
    validateExistsBoardMember, saveBoardMember, getBoardMembers, clearFilters,
    changeKeyword
} from "../actions";
import { changeStateSaveData } from '../../../../dashboard/actions';
import _ from "lodash";
import $ from "jquery";
import {
    OPTION_REQUIRED, VALUE_REQUIERED, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT,
    EDITAR, MESSAGE_LOAD_DATA
} from '../../../../../constantsGlobal';
import { validateResponse, stringValidate } from '../../../../../actionsGlobal';
import { swtShowMessage } from '../../../../sweetAlertMessages/actions';

const fields = ["idBoardMember", "typeOfDocument", "numberDocument", "firstName", "middleName", "firstLastName", "secondLastName"];
const errors = {};

const validate = (values) => {
    if (!values.typeOfDocument) {
        errors.typeOfDocument = OPTION_REQUIRED;
    } else {
        errors.typeOfDocument = null;
    }
    if (!values.numberDocument) {
        errors.numberDocument = VALUE_REQUIERED;
    } else {
        errors.numberDocument = null;
    }
    if (!values.firstName) {
        errors.firstName = VALUE_REQUIERED;
    } else {
        errors.firstName = null;
    }
    if (!values.firstLastName) {
        errors.firstLastName = VALUE_REQUIERED;
    } else {
        errors.firstLastName = null;
    }
    return errors;
};

function GetBtnAllowEditOrBtnSearchExists(props) {
    if (_.isUndefined(props.boardMember)) {
        return <Col xs>
            <dl style={{ width: '100%' }}>
                <button type="button" className="btn btn-primary"
                    style={{ marginTop: '35px' }}
                    onClick={props.thisSelf._validateExistBoardMember}>
                    <i style={{ color: "white", margin: '0em', fontSize: '1.2em' }}
                        className="search icon"></i>
                </button>
            </dl>
        </Col>
    } else {
        if (_.get(props.reducerGlobal.get('permissionsBoardMembers'), _.indexOf(props.reducerGlobal.get('permissionsBoardMembers'), EDITAR), false)) {
            return <Col xs>
                <dl style={{ width: '100%' }}><button type="button" onClick={props.thisSelf._editBoardMember}
                    className={'btn btn-primary modal-button-edit'} style={{ marginTop: '35px' }}>
                    Editar
            <i className={'icon edit'}></i>
                </button>
                </dl>
            </Col>
        } else {
            return <div />
        }
    }
}

class ModalCreateBoardMembers extends Component {

    constructor(props) {
        super(props);
        this._handleBoardMember = this._handleBoardMember.bind(this);
        this._closeCreate = this._closeCreate.bind(this);
        this._validateExistBoardMember = this._validateExistBoardMember.bind(this);
        this._editBoardMember = this._editBoardMember.bind(this);
        this.state = {
            showSuccess: false,
            //controla si se muestra el formulario completo, valores (hidden, visible)
            showCompleteForm: 'hidden',
            //controla si se puede editar la información del miembro de junta, valores (true, false)
            isEditable: false
        }
        momentLocalizer(moment);
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
     * Cierra el modal después de completar el guardado de un miembro de junta
     */
    _closeCreate() {
        const { isOpen, getBoardMembers, validateExistsBoardMember, swtShowMessage,
            boardMembersReducer } = this.props;
        this.setState({
            showSuccess: false
        });
        getBoardMembers(window.localStorage.getItem('idClientSelected'), boardMembersReducer.get('lowerLimit'), NUMBER_RECORDS, '').then((data) => {
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            }
        }, (reason) => {
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
        isOpen();
        this.props.resetForm();
    }

    /**
     * Se ejecuta cuando se da clic en el botón guardar, valida si es para crear o actualizar 
     * un miembro de junta
     */
    _handleBoardMember() {
        const { fields: { idBoardMember, typeOfDocument, numberDocument, firstName, middleName,
            firstLastName, secondLastName }, saveBoardMember, validateExistsBoardMember,
            swtShowMessage, changeStateSaveData, changeKeyword, clearFilters } = this.props;
        var boardMember = {
            idClientBoardMember: null,
            idClient: window.localStorage.getItem('idClientSelected'),
            idBoardMember: idBoardMember.value,
            idTypeOfDocument: typeOfDocument.value,
            numberDocument: numberDocument.value,
            firstName: firstName.value,
            middleName: middleName.value,
            firstLastName: firstLastName.value,
            secondLastName: secondLastName.value
        };
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        saveBoardMember(boardMember).then((data) => {
            changeStateSaveData(false, "");
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            } else {
                if (data.payload.data.data) {
                    this.setState({
                        showSuccess: true
                    });
                    clearFilters();
                    changeKeyword('');
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
        const { fields: { idBoardMember, typeOfDocument, numberDocument, firstName, middleName,
            firstLastName, secondLastName }, validateExistsBoardMember, swtShowMessage,
            changeStateSaveData } = this.props;
        if (stringValidate(typeOfDocument.value) && stringValidate(numberDocument.value)) {
            var jsonBoardMember = {
                idTypeDocument: typeOfDocument.value,
                numberDocument: numberDocument.value,
                idClient: window.localStorage.getItem('idClientSelected')
            };
            changeStateSaveData(true, MESSAGE_LOAD_DATA);
            validateExistsBoardMember(jsonBoardMember).then((data) => {
                if (!validateResponse(data)) {
                    swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                } else {
                    var allowShowCompleteForm = false, cleanFields = false;
                    const detailBoardMember = _.get(data, 'payload.data.data', null);
                    if (detailBoardMember != null) {
                        if (_.get(detailBoardMember, 'idClientBoardMember', null) !== null) {
                            swtShowMessage('warning', 'Relación existente', 'Señor usuario, el miembro de junta ya presenta una relación con el cliente');
                            cleanFields = true;
                            allowShowCompleteForm = false;
                        } else {
                            idBoardMember.onChange(detailBoardMember.idBoardMember);
                            typeOfDocument.onChange(detailBoardMember.idTypeOfDocument);
                            numberDocument.onChange(detailBoardMember.numberDocument);
                            firstName.onChange(detailBoardMember.firstName);
                            middleName.onChange(detailBoardMember.middleName);
                            firstLastName.onChange(detailBoardMember.firstLastName);
                            secondLastName.onChange(detailBoardMember.secondLastName);
                            allowShowCompleteForm = true;
                        }
                    } else {
                        allowShowCompleteForm = true;
                        cleanFields = true;
                    }
                    if (cleanFields) {
                        idBoardMember.onChange('');
                        firstName.onChange('');
                        middleName.onChange('');
                        firstLastName.onChange('');
                        secondLastName.onChange('');
                    }
                    if (allowShowCompleteForm) {
                        this.setState({
                            showCompleteForm: 'visible'
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

    componentWillMount() {
        const { boardMember } = this.props;
        if (boardMember !== undefined) {
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
        const { initialValues, fields: { idBoardMember, typeOfDocument, numberDocument, firstName,
            middleName, firstLastName, secondLastName }, handleSubmit, error, boardMember, reducerGlobal, selectsReducer } = this.props;
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
                                        parentId="dashboardComponentScroll"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        data={selectsReducer.get(CONTACT_ID_TYPE) || []}
                                    />
                                </dt>
                            </Col>
                            <Col xs>
                                <dt><span>Número de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                                <InputComponent
                                    name="numberDocument"
                                    type="text"
                                    max="250"
                                    {...numberDocument}
                                    disabled={this.state.isEditable ? '' : 'disabled'}
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
                                    max="250"
                                    {...firstName}
                                    disabled={this.state.isEditable ? '' : 'disabled'}
                                />
                            </Col>
                            <Col xs>
                                <dt><span>Segundo nombre </span></dt>
                                <InputComponent
                                    name="middleName"
                                    type="text"
                                    max="250"
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
                                    max="250"
                                    {...firstLastName}
                                    disabled={this.state.isEditable ? '' : 'disabled'}
                                />
                            </Col>
                            <Col xs>
                                <dt><span>Segundo apellido </span></dt>
                                <InputComponent
                                    name="<secondLastName></secondLastName>"
                                    type="text"
                                    max="250"
                                    {...secondLastName}
                                    disabled={this.state.isEditable ? '' : 'disabled'}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="submit" className="btn btn-primary modal-button-edit"
                        style={{ visibility: this.state.showCompleteForm }}
                        disabled={this.state.isEditable ? '' : 'disabled'}>
                        <span>Guardar</span>
                    </button>
                </div>
                <SweetAlert
                    type="success"
                    show={this.state.showSuccess}
                    title="Miembro de junta"
                    text="Señor usuario, el miembro de junta ha sido guardado exitosamente"
                    onConfirm={() => this._closeCreate()}
                />
            </form>
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
                secondLastName: boardMember.secondLastName
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
                secondLastName: null
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
