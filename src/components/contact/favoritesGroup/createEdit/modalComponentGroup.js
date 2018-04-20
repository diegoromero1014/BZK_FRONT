import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { reduxForm } from "redux-form";
import { Col, Row } from "react-flexbox-grid";
import {
    addContactList, changeKeywordNameNewGroup, clearContactName, clearFilterGroup, deleteContactList,
    getGroupForId, getListContactGroupForId, getValidateExistGroup, groupFindServer,
    resetModal, saveGroupFavoriteContacts, saveNameGroup, searchContactForGroup
} from "../actions";
import { contactsFindServer } from "../../../filterContact/actions";
import { swtShowMessage } from "../../../sweetAlertMessages/actions";
import {joinName, shorterStringValue, xssValidation} from "../../../../actionsGlobal";
import { showLoading } from "../../../loading/actions";
import ButtonDeleteLocalComponent from "../../../grid/buttonDeleteLocalComponent";
import ComboBoxFilter from "../../../../ui/comboBoxFilter/comboBoxFilter";
import {MESSAGE_ERROR, MESSAGE_LOAD_DATA, VALUE_XSS_INVALID} from "../../../../constantsGlobal";
import $ from "jquery";
import BtnAddByFunctionOrType from './btnAddByFunctionOrType';
import { MAXIMUM_NUMBER_OF_CONTACTS_FOR_GROUP } from '../constants';

var listContact = [];
const fields = ['contact', 'searchGroup', 'tipoDocumento', 'numeroDocumento'];
var thisForm;

class ModalComponentGroup extends Component {

    constructor(props) {
        super(props);
        thisForm = this;
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this._renderCellView = this._renderCellView.bind(this);
        this._handleValidateExistGroup = this._handleValidateExistGroup.bind(this);
        this._handleValidateExistGroupSearch = this._handleValidateExistGroupSearch.bind(this);
        this._searchContactForGroup = this._searchContactForGroup.bind(this);
        this._onClickLimpiar = this._onClickLimpiar.bind(this);
        this._addContactList = this._addContactList.bind(this);
        this._deleteContactList = this._deleteContactList.bind(this);
        this._onClickLimpiarNameGroup = this._onClickLimpiarNameGroup.bind(this);
        this._saveGroupFavoriteContacts = this._saveGroupFavoriteContacts.bind(this);
        this._handleKeyValidateExistGroup = this._handleKeyValidateExistGroup.bind(this);
        this.updateKeyValueContact = this.updateKeyValueContact.bind(this);
        this.state = {
            modalIsOpen: false,
            visibleMessage: 'block',
            visibleTable: "none",
            visibleNameContact: "none",
            searchContact: "none",
            createGroup: true,
            disableName: '',
            disableSave: 'none',
            disabled: 'disabled',
            validateExistGroup: false,
        };
    }

    componentWillMount() {
        const { groupId, getGroupForId,
            getListContactGroupForId, clearContactName, resetForm,
            resetModal, fields: { searchGroup }, showLoading, swtShowMessage
            } = this.props;
        resetForm();
        resetModal();
        if (groupId != undefined) {
            showLoading(true, MESSAGE_LOAD_DATA);
            getGroupForId(groupId);
            getListContactGroupForId(groupId).then((data) => {
                if (!_.isEqual(_.get(data, 'payload.data.status'), 200)) {
                    swtShowMessage('error', 'Error servidor', 'Lo sentimos, ocurrió un error en el servidor');
                }
                showLoading(false, '');
            });
            this.setState({ disableName: '', disabled: '' });
        } else {
            searchGroup.value = '';
            clearContactName();
            resetForm();
            resetModal();
        }
    }

    _handleKeyValidateExistGroup(e) {
        if (e.keyCode === 13 || e.which === 13) {
            e.consultclick ? "" : e.preventDefault();
            this._handleValidateExistGroupSearch();
        }
    }

    _handleValidateExistGroup() {
        const { showLoading, fields: { searchGroup }, getValidateExistGroup, swtShowMessage, resetForm, resetModal, saveNameGroup, groupsFavoriteContacts } = this.props;
        showLoading(true, MESSAGE_LOAD_DATA);
        if (!_.isEqual(searchGroup.value.trim(), '')) {
                getValidateExistGroup(searchGroup.value).then((data) => {
                    const groupSearch = _.get(data.payload, 'data.data', null);
                    if (!_.isNull(groupSearch)) {
                        if (groupsFavoriteContacts.get('group').get('id') == groupSearch.id) {
                            saveNameGroup(searchGroup.value);
                            thisForm._saveGroupFavoriteContacts();
                        } else {
                            if (groupsFavoriteContacts.get('group').get('id') !== '') {
                                swtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no se encuentra disponible');
                                saveNameGroup(searchGroup.value);
                            } else {
                                swtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no se encuentra disponible');
                                resetForm();
                                resetModal();
                                this.setState({ disableName: '', disabled: 'disabled', validateExistGroup: false });
                            }
                            showLoading(false, '');
                        }
                    } else {
                        this.setState({ disableName: '', disabled: '', validateExistGroup: true });
                        saveNameGroup(searchGroup.value);
                        thisForm._saveGroupFavoriteContacts();
                    }
                });

        } else {
            swtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no puede estar vacio');
        }
    }

    _handleValidateExistGroupSearch() {
        const { showLoading, fields: { searchGroup }, getValidateExistGroup, swtShowMessage, resetForm, resetModal, saveNameGroup, groupsFavoriteContacts } = this.props;
        showLoading(true, MESSAGE_LOAD_DATA);
        if (!_.isEqual(searchGroup.value.trim(), '')) {

            if (xssValidation(searchGroup.value)){
                swtShowMessage(MESSAGE_ERROR, 'Caracteres inválidos', VALUE_XSS_INVALID);
                resetForm();
                resetModal();
                this.setState({ disableName: '', disabled: 'disabled', validateExistGroup: false });
                showLoading(false, '');
            }
            else{
                getValidateExistGroup(searchGroup.value).then((data) => {
                    const groupSearch = _.get(data.payload, 'data.data', null);
                    if (!_.isNull(groupSearch)) {
                        if (groupsFavoriteContacts.get('group').get('id') == groupSearch.id) {
                            saveNameGroup(searchGroup.value);
                            showLoading(false, '');
                        } else {
                            if (groupsFavoriteContacts.get('group').get('id') !== '') {
                                swtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no se encuentra disponible');
                                saveNameGroup(searchGroup.value);
                            } else {
                                swtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no se encuentra disponible');
                                resetForm();
                                resetModal();
                                this.setState({ disableName: '', disabled: 'disabled', validateExistGroup: false });
                            }
                            showLoading(false, '');
                        }
                    } else {
                        if (groupsFavoriteContacts.get('group').get('id') !== '') {
                            saveNameGroup(searchGroup.value);
                            showLoading(false, '');
                        } else {
                            this.setState({ disableName: '', disabled: '', validateExistGroup: true });
                            saveNameGroup(searchGroup.value);
                            showLoading(false, '');
                        }
                    }
                });
            }


        } else {
            swtShowMessage('error', 'Nombre de grupo', 'Señor usuario, el nombre de grupo no puede estar vacio');
        }
    }

    _saveGroupFavoriteContacts() {
        const { showLoading, groupsFavoriteContacts, clearFilterGroup, saveGroupFavoriteContacts, swtShowMessage, keyWordName, pageNum } = this.props;
        const group = groupsFavoriteContacts.get('group');
        const list = groupsFavoriteContacts.get('group').get('listContact');
        if (_.size(list) > 1) {
            saveGroupFavoriteContacts(group.toJSON()).then((data) => {
                if (data.payload.data.status == 200) {
                    swtShowMessage('success', 'Guardar', 'Señor usuario, se ha guardado con éxito.');
                    thisForm.closeModal();
                    clearFilterGroup();
                } else {
                    swtShowMessage('Error', 'Guardar', 'Señor usuario, se ha producido un error en el servidor.');
                }
            });
        } else {
            swtShowMessage('error', 'Guardar', 'Señor usuario, debe agregar por lo menos dos contactos');
        }
        showLoading(false, '');
    }

    _addContactList() {
        const { addContactList, clearContactName, groupsFavoriteContacts, resetForm, swtShowMessage, fields: { numeroDocumento, tipoDocumento, contact } } = this.props;
        const contactReduce = groupsFavoriteContacts.get('contact');
        const list = groupsFavoriteContacts.get('group').get('listContact');
        const exist = _.findIndex(list, (item) => _.isEqual(item.id, contactReduce.id));
        if (exist >= 0) {
            swtShowMessage('error', 'Contacto duplicado', 'Señor usuario, el contacto ya se encuentra en el grupo');
        } else {
            if (_.size(list) === MAXIMUM_NUMBER_OF_CONTACTS_FOR_GROUP) {
                swtShowMessage('error', 'Contactos máximos', 'Señor usuario, el grupo tiene la máxima cantidad de contactos');
            } else {
                if (!_.isNull(_.get(contactReduce, 'emailAddress', null))) {
                    addContactList();
                } else {
                    swtShowMessage('error', 'Contacto', 'Señor usuario, el contacto no tiene correo electrónico');
                }
            }
            clearContactName();
            contact.onChange('');
            numeroDocumento.onChange('');
            tipoDocumento.onChange('');
        }
    }

    _renderCellView(contact, idx) {
        const message = "Señor usuario ¿está seguro que desea eliminar el contacto ";
        return <tr key={idx}>
            <td>{contact.document}</td>
            <td>{shorterStringValue(contact.completeName, 50)}</td>
            <td>{contact.email}</td>
            <td className="collapsing">
                <ButtonDeleteLocalComponent key={contact.id} message={`${message} ${contact.completeName}?`} typeAction="icon"
                    fn={this._deleteContactList} args={[contact]} />
            </td>
        </tr>

    }

    _deleteContactList(contact) {
        this.props.deleteContactList(contact.id);
    }

    _searchContactForGroup() {
        const { fields: { tipoDocumento, numeroDocumento, contact }, swtShowMessage, searchContactForGroup } = this.props;
        if (!_.isEqual(numeroDocumento.value.trim(), '') && !_.isEqual(tipoDocumento.value, '')) {
            searchContactForGroup(tipoDocumento.value, numeroDocumento.value, '').then((data) => {
                thisForm._addContactList();
            });
        } else {
            swtShowMessage('error', 'Campos obligatorios', 'Señor usuario, para agregar un contacto debe ingresar los campos obligatorios.');
        }
    }

    _onClickLimpiarNameGroup() {
        const { resetForm, resetModal } = this.props;
        resetForm();
        resetModal();
        this.setState({ disableName: '', disabled: 'disabled' });
    }

    _onClickLimpiar() {
        const { resetForm, clearContactName } = this.props;
        resetForm();
        clearContactName();
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
        $('.remove.icon.modal-icon-close').click();
    }

    componentDidMount() {
        $("#iconSearchContact").click(function () {
            var e = { keyCode: 13, consultclick: true };
            thisForm.updateKeyValueContact(e);
        });
    }

    updateKeyValueContact(e) {
        const { fields: { contact, tipoDocumento, numeroDocumento }, swtShowMessage, contactsFindServer } = this.props;
        if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
            e.consultclick ? "" : e.preventDefault();
            if (contact.value !== "" && contact.value !== null && contact.value !== undefined && contact.value.length >= 3) {
                $('.ui.search.contactSearch').toggleClass('loading');
                contactsFindServer(contact.value, false, 0, -1).then((data) => {
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
                swtShowMessage('error', 'Error de búsqueda', 'Señor usuario, debe ingresar por lo menos tres caracteres.');
            }
        }
    }

    render() {
        let { groupId, fields: { contact, searchGroup }, groupsFavoriteContacts, selectsReducer } = this.props;
        let { createGroup, searchContact, visibleMessage, visibleTable, visibleNameContact } = this.state;
        const data = groupsFavoriteContacts.get('group').get('listContact');
        let countFilter = _.size(data);
        if (countFilter !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        } else {
            visibleTable = 'none';
            visibleMessage = 'block';
        }
        var typeCursor = "pointer";
        if (this.state.disabled === "") {
            typeCursor = "noDrop";
        }
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
                                        onKeyPress={this._handleKeyValidateExistGroup}
                                        className="input-lg input InputAddOn-field" />
                                    <button onClick={this._handleValidateExistGroupSearch}
                                        className="button InputAddOn-item">
                                        <i className="search icon" />
                                    </button>

                                    <button type="button" className="btn btn-primary" style={{ marginLeft: "20px" }}
                                        onClick={this._onClickLimpiarNameGroup}>
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
                                <button className="btn btn-primary" type="button" onClick={this._searchContactForGroup}
                                    disabled={this.state.disabled} style={{ cursor: typeCursor, marginTop: '20px' }}>
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
                            <Col xs={12} sm={12} md={12} lg={12} style={{ display: visibleTable }}>
                                <div className="horizontal-scroll-wrapper"
                                    style={{ overflow: 'scroll', background: '#fff', maxHeight: "200px !important", overflow: "scroll" }}>
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
                                            {data.map(this._renderCellView)}
                                        </tbody>
                                    </table>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} style={{ display: visibleMessage }}>
                                <div
                                    style={{ padding: "15px", fontSize: '15px', textAlign: 'center', width: '100%' }}>
                                    No se han adicionado contactos
                                </div>
                            </Col>
                        </Row>
                    </div>

                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="button" onClick={this._handleValidateExistGroup}
                        disabled={this.state.disabled} style={{ cursor: typeCursor }}
                        className="btn btn-primary modal-button-edit">Guardar
                    </button>
                </div>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getGroupForId,
        changeKeywordNameNewGroup,
        getListContactGroupForId,
        getValidateExistGroup,
        searchContactForGroup,
        swtShowMessage,
        addContactList,
        clearContactName,
        deleteContactList,
        saveGroupFavoriteContacts,
        resetModal,
        groupFindServer,
        contactsFindServer,
        saveNameGroup,
        clearFilterGroup, showLoading
    }, dispatch);
}

function mapStateToProps({ groupsFavoriteContacts, selectsReducer }, ownerProps) {
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

