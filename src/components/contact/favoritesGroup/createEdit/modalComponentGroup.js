import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { reduxForm } from "redux-form";
import { Col, Row } from "react-flexbox-grid";
import $ from "jquery";

import ButtonDeleteLocalComponent from "../../../grid/buttonDeleteLocalComponent";
import ComboBoxFilter from "../../../../ui/comboBoxFilter/comboBoxFilter";
import BtnAddByFunctionOrType from './btnAddByFunctionOrType';

import { contactsFindServer } from "../../../filterContact/actions";
import { swtShowMessage } from "../../../sweetAlertMessages/actions";
import { showLoading } from "../../../loading/actions";
import { shorterStringValue, xssValidation } from "../../../../actionsGlobal";
import {
    addContactList, clearContactName, clearFilterGroup, deleteContactList,
    getGroupForId, getListContactGroupForId, getValidateExistGroup,
    resetModal, saveGroupFavoriteContacts, saveNameGroup, searchContactForGroup
} from "../actions";

import { MESSAGE_ERROR, MESSAGE_LOAD_DATA, VALUE_XSS_INVALID } from "../../../../constantsGlobal";
import { MAXIMUM_NUMBER_OF_CONTACTS_FOR_GROUP } from '../constants';
import _ from 'lodash';

var listContact = [];
const fields = ['contact', 'searchGroup', 'tipoDocumento', 'numeroDocumento'];
var thisForm;

export class ModalComponentGroup extends Component {

    constructor(props) {
        super(props);
        thisForm = this;
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.renderCellView = this.renderCellView.bind(this);
        this.handleValidateExistGroup = this.handleValidateExistGroup.bind(this);
        this.handleValidateExistGroupSearch = this.handleValidateExistGroupSearch.bind(this);
        this.searchContactForGroup = this.searchContactForGroup.bind(this);
        this.onClickLimpiar = this.onClickLimpiar.bind(this);
        this.addContactList = this.addContactList.bind(this);
        this.deleteContactList = this.deleteContactList.bind(this);
        this.onClickLimpiarNameGroup = this.onClickLimpiarNameGroup.bind(this);
        this.saveGroupFavoriteContacts = this.saveGroupFavoriteContacts.bind(this);
        this.handleKeyValidateExistGroup = this.handleKeyValidateExistGroup.bind(this);
        this.updateKeyValueContact = this.updateKeyValueContact.bind(this);
        this.state = {
            modalIsOpen: false,
            visibleNameContact: "none",
            searchContact: "none",
            createGroup: true,
            disableName: '',
            disableSave: 'none',
            disabled: 'disabled',
            validateExistGroup: false,
            visibleMessage: 'block',
            visibleTable: 'none'
        };
    }

    noop = () => {
        //
    }

    componentWillMount() {
        const { 
            groupId, 
            dispatchGetGroupForId, 
            dispatchGetListContactGroupForId, 
            dispatchClearContactName, 
            resetForm, 
            dispatchResetModal, 
            fields: { 
                searchGroup 
            }, 
            dispatchShowLoading, 
            dispatchSwtShowMessage 
        } = this.props;
        resetForm();
        dispatchResetModal();
        if (groupId != undefined) {
            dispatchShowLoading(true, MESSAGE_LOAD_DATA);
            dispatchGetGroupForId(groupId);
            dispatchGetListContactGroupForId(groupId).then((data) => {
                if (!_.isEqual(_.get(data, 'payload.data.status'), 200)) {
                    dispatchSwtShowMessage('error', 'Error servidor', 'Lo sentimos, ocurrió un error en el servidor');
                }
                dispatchShowLoading(false, '');
            });
            this.setState({ disableName: '', disabled: '' });
        } else {
            searchGroup.value = '';
            dispatchClearContactName();
            resetForm();
            dispatchResetModal();
        }
    }

    handleKeyValidateExistGroup = e => {
        if (e.keyCode === 13 || e.which === 13) {
            e.consultclick ? this.noop() : e.preventDefault();
            this.handleValidateExistGroupSearch();
        }
    }

    handleValidateExistGroup = () => {
        const { 
            dispatchShowLoading, 
            fields: { 
                searchGroup 
            }, 
            dispatchGetValidateExistGroup, 
            dispatchSwtShowMessage, 
            resetForm, 
            dispatchResetModal, 
            dispatchSaveNameGroup, 
            groupsFavoriteContacts 
        } = this.props;
        searchGroup.onChange(searchGroup.value.trim());
        if (!_.isEqual(searchGroup.value.trim(), '')) {
            dispatchGetValidateExistGroup(searchGroup.value).then((data) => {
                const groupSearch = _.get(data.payload, 'data.data', null);
                if (!_.isNull(groupSearch)) {
                    if (groupsFavoriteContacts.get('group').get('id') == groupSearch.id) {
                        dispatchSaveNameGroup(searchGroup.value);
                        thisForm.saveGroupFavoriteContacts();
                    } else {
                        if (groupsFavoriteContacts.get('group').get('id') !== '') {
                            dispatchSwtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no se encuentra disponible');
                            dispatchSaveNameGroup(searchGroup.value);
                        } else {
                            dispatchSwtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no se encuentra disponible');
                            resetForm();
                            dispatchResetModal();
                            this.setState({ disableName: '', disabled: 'disabled', validateExistGroup: false });
                        }
                        dispatchShowLoading(false, '');
                    }
                } else {
                    this.setState({ disableName: '', disabled: '', validateExistGroup: true });
                    dispatchSaveNameGroup(searchGroup.value);
                    thisForm.saveGroupFavoriteContacts();
                }
            });

        } else {
            dispatchShowLoading(false, '');
            dispatchSwtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no puede estar vacio');

        }
    }

    handleValidateExistGroupSearch = () => {
        const { 
            dispatchShowLoading, 
            fields: { 
                searchGroup 
            }, 
            dispatchGetValidateExistGroup, 
            dispatchSwtShowMessage, 
            resetForm, 
            dispatchResetModal, 
            dispatchSaveNameGroup, 
            groupsFavoriteContacts 
        } = this.props;
        searchGroup.onChange(searchGroup.value.trim());
        if (!_.isEqual(searchGroup.value.trim(), '')) {
            if (xssValidation(searchGroup.value)) {
                dispatchSwtShowMessage(MESSAGE_ERROR, 'Caracteres inválidos', VALUE_XSS_INVALID);
                dispatchShowLoading(false, '');
            }
            else {
                dispatchGetValidateExistGroup(searchGroup.value).then((data) => {
                    const groupSearch = _.get(data.payload, 'data.data', null);
                    if(data.payload.data.status == 200){
                        if (!_.isNull(groupSearch)) {
                            if (groupsFavoriteContacts.get('group').get('id') == groupSearch.id) {
                                dispatchSaveNameGroup(searchGroup.value);
                                dispatchShowLoading(false, '');
                            } else {
                                if (groupsFavoriteContacts.get('group').get('id') !== '') {
                                    dispatchSwtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no se encuentra disponible');
                                    dispatchSaveNameGroup(searchGroup.value);
                                } else {
                                    dispatchSwtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no se encuentra disponible');
                                    resetForm();
                                    dispatchResetModal();
                                    this.setState({ disableName: '', disabled: 'disabled', validateExistGroup: false });
                                }
                                dispatchShowLoading(false, '');
                            }
                        } else {
                            if (groupsFavoriteContacts.get('group').get('id') !== '') {
                                dispatchSaveNameGroup(searchGroup.value);
                                dispatchShowLoading(false, '');
                            } else {
                                this.setState({ disableName: '', disabled: '', validateExistGroup: true });
                                dispatchSaveNameGroup(searchGroup.value);
                                dispatchShowLoading(false, '');
                            }
                        }
                    } else if (data.payload.data.status == 422) {
                        dispatchSwtShowMessage(MESSAGE_ERROR, 'Caracteres inválidos', VALUE_XSS_INVALID);
                        dispatchShowLoading(false, '');
                    } else {
                        dispatchSwtShowMessage(MESSAGE_ERROR, 'Error en el servidor', 'Ocurrió un error en el servidor');
                        dispatchShowLoading(false, '');
                    }
                });
            }


        } else {
            dispatchShowLoading(false, '');
            dispatchSwtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no puede estar vacio');
        }
    }

    saveGroupFavoriteContacts = () => {
        const { dispatchShowLoading, groupsFavoriteContacts, dispatchClearFilterGroup, dispatchSaveGroupFavoriteContacts, dispatchSwtShowMessage } = this.props;
        const group = groupsFavoriteContacts.get('group');
        const list = groupsFavoriteContacts.get('group').get('listContact');
        if (_.size(list) > 1) {
            dispatchSaveGroupFavoriteContacts(group.toJSON()).then((data) => {
                if (data.payload.data.status == 200) {
                    dispatchSwtShowMessage('success', 'Guardar', 'Señor usuario, se ha guardado con éxito.');
                    thisForm.closeModal();
                    dispatchClearFilterGroup();
                } else {
                    dispatchSwtShowMessage('Error', 'Guardar', 'Señor usuario, se ha producido un error en el servidor.');
                }
            });
        } else {
            dispatchSwtShowMessage('error', 'Guardar', 'Señor usuario, debe agregar por lo menos dos contactos');
        }
        dispatchShowLoading(false, '');
    }

    addContactList = () => {
        const { 
            dispatchAddContactList, 
            dispatchClearContactName, 
            groupsFavoriteContacts,
            dispatchSwtShowMessage, 
            fields: { 
                numeroDocumento, 
                tipoDocumento, 
                contact 
            } 
        } = this.props;
        const contactReduce = groupsFavoriteContacts.get('contact');
        const list = groupsFavoriteContacts.get('group').get('listContact');
        const exist = _.findIndex(list, (item) => _.isEqual(item.id, contactReduce.id));
        if (exist >= 0) {
            dispatchSwtShowMessage('error', 'Contacto duplicado', 'Señor usuario, el contacto ya se encuentra en el grupo');
        } else {
            if (_.size(list) === MAXIMUM_NUMBER_OF_CONTACTS_FOR_GROUP) {
                dispatchSwtShowMessage('error', 'Contactos máximos', 'Señor usuario, el grupo tiene la máxima cantidad de contactos');
            } else {
                if (!_.isNull(_.get(contactReduce, 'emailAddress', null))) {
                    dispatchAddContactList();
                } else {
                    dispatchSwtShowMessage('error', 'Contacto', 'Señor usuario, el contacto no tiene correo electrónico');
                }
            }
            dispatchClearContactName();
            contact.onChange('');
            numeroDocumento.onChange('');
            tipoDocumento.onChange('');
        }
    }

    renderCellView = (contact, idx) => {
        const message = "Señor usuario ¿está seguro que desea eliminar el contacto ";
        return <tr key={idx}>
            <td>{contact.document}</td>
            <td>{shorterStringValue(contact.completeName, 50)}</td>
            <td>{contact.email}</td>
            <td className="collapsing">
                <ButtonDeleteLocalComponent key={contact.id} message={`${message} ${contact.completeName}?`} typeAction="icon"
                    fn={this.deleteContactList} args={[contact]} />
            </td>
        </tr>

    }

    deleteContactList = contact => {
        this.props.dispatchDeleteContactList(contact.id);
    }

    searchContactForGroup = () => {
        const { 
            fields: { 
                tipoDocumento, 
                numeroDocumento 
            }, 
            dispatchSwtShowMessage, 
            dispatchSearchContactForGroup 
        } = this.props;
        if (!_.isEqual(numeroDocumento.value.trim(), '') && !_.isEqual(tipoDocumento.value, '')) {
            dispatchSearchContactForGroup(tipoDocumento.value, numeroDocumento.value, '').then((data) => {
                thisForm.addContactList();
            });
        } else {
            dispatchSwtShowMessage('error', 'Campos obligatorios', 'Señor usuario, para agregar un contacto debe ingresar los campos obligatorios.');
        }
    }

    onClickLimpiarNameGroup = () => {
        const { resetForm, dispatchResetModal } = this.props;
        resetForm();
        dispatchResetModal();
        this.setState({ disableName: '', disabled: 'disabled' });
    }

    onClickLimpiar = () => {
        const { resetForm, dispatchClearContactName } = this.props;
        resetForm();
        dispatchClearContactName();
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false });
        $('.remove.icon.modal-icon-close').click();
    }

    componentDidMount() {
        $("#iconSearchContact").click(function () {
            var e = { keyCode: 13, consultclick: true };
            thisForm.updateKeyValueContact(e);
        });
    }

    updateKeyValueContact = e => {
        const { fields: { contact, tipoDocumento, numeroDocumento }, dispatchSwtShowMessage, dispatchContactsFindServer } = this.props;
        if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
            e.consultclick ? this.noop() : e.preventDefault();
            if (contact.value !== "" && contact.value !== null && contact.value !== undefined && contact.value.length >= 3) {
                $('.ui.search.contactSearch').toggleClass('loading');
                dispatchContactsFindServer(contact.value, false, 0, -1).then((data) => {
                    listContact = _.get(data, 'payload', []);
                    listContact = listContact.data.data.listContact;
                    $('.ui.search.contactSearch')
                        .search({
                            cache: false,
                            source: listContact,
                            maxResults: 1500,
                            searchFields: [
                                'title',
                                'description',
                                'id',
                            ],

                            onSelect: function (event) {
                                tipoDocumento.onChange(event.idTypeDocument);
                                numeroDocumento.onChange(event.numberDocument);
                                return 'default';
                            }
                        });
                    $('.ui.search.contactSearch').toggleClass('loading');
                    setTimeout(function () {
                        $('#contactSearch').focus();
                    }, 150);
                });
            } else {
                dispatchSwtShowMessage('error', 'Error de búsqueda', 'Señor usuario, debe ingresar por lo menos tres caracteres.');
            }
        }
    }


    render() {
        let { fields: { contact, searchGroup }, groupsFavoriteContacts } = this.props;
                
        const data = groupsFavoriteContacts.get('group').get('listContact');
        const countFilter = _.size(data);

        return (
            <div>
                <div className="modalBt4-body modal-body"
                    style={{ overflowX: 'hidden', minHeight: "400px" }}>
                    <div style={{ margin: "-15px", padding: "15px 25px" }}>
                        <Row style={{ borderBottom: "1px solid #D9DEDF" }}>
                            <Col xs={10} sm={10} md={10} lg={10}>
                                <dt><span>Nombre del grupo (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                <div className="InputAddOn">
                                    <input type="text" style={{ padding: '0px 11px !important' }}
                                        placeholder="Nombre de grupo"
                                        disabled={this.state.disableName}
                                        {...searchGroup}
                                        maxlength="150"
                                        onKeyPress={this.handleKeyValidateExistGroup}
                                        className="input-lg input InputAddOn-field" />
                                    <button onClick={this.handleValidateExistGroupSearch}
                                        className="button InputAddOn-item">
                                        <i className="search icon" />
                                    </button>

                                    <button type="button" className="btn btn-primary" style={{ marginLeft: "20px" }}
                                        onClick={this.onClickLimpiarNameGroup}>
                                        <i style={{ color: "white", margin: '0em', fontSize: '1.2em' }}
                                            className="erase icon" />
                                    </button>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ borderBottom: "1px solid #D9DEDF", paddingTop: "15px", paddingBottom: "10px" }}>
                            <Col xs={12} md={9} lg={9}>
                                <dt><span>Contacto </span></dt>
                                <dd>
                                    <div className="ui dropdown search contactSearch fluid"
                                        style={{ border: "0px", zIndex: "1", padding: "0px" }}>
                                        <ComboBoxFilter className="prompt" id="contactSearch" idIcon="iconSearchContact"
                                            style={{ borderRadius: "3px" }}
                                            autoComplete="off"
                                            type="text"
                                            disabled={this.state.disabled}
                                            {...contact}
                                            value={contact.value}
                                            placeholder="Ingrese un criterio de búsqueda..."
                                            onKeyPress={this.updateKeyValueContact}
                                            touched={true}
                                        />
                                    </div>
                                </dd>
                            </Col>
                            <Col xs={12} md={2} lg={2}>
                                <button 
                                    className="btn btn-primary" 
                                    type="button" 
                                    onClick={this.searchContactForGroup}
                                    disabled={this.state.disabled} 
                                    style={{ 
                                        cursor: this.state.disabled === "" ? "noDrop" : "pointer", 
                                        marginTop: '20px' 
                                    }}>
                                    <i className="plus icon"></i> Agregar
                                </button>
                            </Col>
                            <BtnAddByFunctionOrType disabled={this.state.disabled} />
                        </Row>
                        <Row>
                            <div
                                style={{ padding: "15px", fontSize: '25px', textAlign: 'center', width: '100%' }}>
                                Total: {countFilter}
                            </div>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} style={{ display: countFilter !== 0 ? 'block' : 'none' }}>
                                <div className="horizontal-scroll-wrapper"
                                    style={{ overflow: 'scroll', background: '#fff', maxHeight: "200px !important" }}>
                                    <table className="ui striped table">
                                        <thead>
                                            <tr>
                                                <th>Documento</th>
                                                <th>Nombre</th>
                                                <th>Correo electrónico</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map(this.renderCellView)}
                                        </tbody>
                                    </table>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} style={{ display:  countFilter !== 0 ? 'none' : 'block' }}>
                                <div
                                    style={{ padding: "15px", fontSize: '15px', textAlign: 'center', width: '100%' }}>
                                    No se han adicionado contactos
                                </div>
                            </Col>
                        </Row>
                    </div>

                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="button" onClick={this.handleValidateExistGroup}
                        disabled={this.state.disabled} style={{ cursor: this.state.disabled === "" ? "noDrop" : "pointer" }}
                        className="btn btn-primary modal-button-edit">Guardar
                    </button>
                </div>
            </div>

        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchGetGroupForId: getGroupForId,
        dispatchGetListContactGroupForId: getListContactGroupForId,
        dispatchGetValidateExistGroup: getValidateExistGroup,
        dispatchSearchContactForGroup: searchContactForGroup,
        dispatchSwtShowMessage: swtShowMessage,
        dispatchAddContactList: addContactList,
        dispatchClearContactName: clearContactName,
        dispatchDeleteContactList: deleteContactList,
        dispatchSaveGroupFavoriteContacts: saveGroupFavoriteContacts,
        dispatchResetModal: resetModal,
        dispatchContactsFindServer: contactsFindServer,
        dispatchSaveNameGroup: saveNameGroup,
        dispatchClearFilterGroup: clearFilterGroup, 
        dispatchShowLoading: showLoading
    }, dispatch);
}

const mapStateToProps = ({ groupsFavoriteContacts, selectsReducer }) => {
    const keyWordName = groupsFavoriteContacts.get('pageNum');
    const pageNum = groupsFavoriteContacts.get('keywordName');
    const searchGroup = groupsFavoriteContacts.get('group').get('name').trim();
    return {
        groupsFavoriteContacts,
        selectsReducer,
        keyWordName,
        pageNum,
        initialValues: {
            searchGroup
        }
    };
}


export default reduxForm({
    form: 'FORM_SEARCH_CONTACTS',
    fields
}, mapStateToProps, mapDispatchToProps)(ModalComponentGroup);