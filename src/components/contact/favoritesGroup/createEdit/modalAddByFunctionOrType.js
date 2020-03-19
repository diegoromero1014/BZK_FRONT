import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { reduxForm } from "redux-form";
import { Col, Row } from "react-flexbox-grid";
import { swtShowMessage } from "../../../sweetAlertMessages/actions";
import ComboBox from "../../../../ui/comboBox/comboBoxComponent";
import {
    MESSAGE_LOAD_DATA, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT, MESSAGE_ERROR,
    MESSAGE_SUCCESS
} from "../../../../constantsGlobal";
import { stringValidate, validateResponse } from "../../../../actionsGlobal";
import { getMasterDataFields } from "../../../selectsComponent/actions";
import { FILTER_TYPE_CONTACT_ID, FILTER_FUNCTION_ID } from "../../../selectsComponent/constants";
import ListResultFuntionOrType from './listResultFunctionOrType';
import Tooltip from '../../../toolTip/toolTipComponent';
import {
    getContactsByTypeOrFunction, associateContactsByFunctionOrType, setFunctionContactsByFunctionOrType,
    setTypeContactsByFunctionOrType, setKeywordContactsByFunctionOrType, pageNumContactsByFunctionOrType,
    setContactsByFunctionOrType
} from '../actions';
import { FIRST_PAGE, NUMBER_RECORDS, MAXIMUM_NUMBER_OF_CONTACTS_FOR_GROUP } from '../constants';
import { changeStateSaveData } from '../../../main/actions';

const fields = ["typeOfContact", "functionOfContact", "keyword"];

class ModalAddByFunctionOrType extends Component {

    constructor(props) {
        super(props);
        this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
        this._getContactsByTypeOrFunction = this._getContactsByTypeOrFunction.bind(this);
        this._onClickCleanForm = this._onClickCleanForm.bind(this);
        this._handleSearchContacts = this._handleSearchContacts.bind(this);
        this._associateContacts = this._associateContacts.bind(this);
    }

    componentWillMount() {
        const { getMasterDataFields, setContactsByFunctionOrType, setFunctionContactsByFunctionOrType,
            setKeywordContactsByFunctionOrType, setTypeContactsByFunctionOrType } = this.props;
        getMasterDataFields([FILTER_TYPE_CONTACT_ID, FILTER_FUNCTION_ID]);
        setContactsByFunctionOrType([]);
        setFunctionContactsByFunctionOrType(null);
        setKeywordContactsByFunctionOrType("");
        setTypeContactsByFunctionOrType(null);
    }

    _handleChangeKeyword(e) {
        const { fields: { keyword }, setKeywordContactsByFunctionOrType } = this.props;
        setKeywordContactsByFunctionOrType(e.target.value);
        keyword.onChange(e.target.value);
        if (e.keyCode === 13 || e.which === 13) {
            this._handleSearchContacts();
        }
    }

    _onClickCleanForm() {
        const { fields: { functionOfContact, typeOfContact, keyword }, setContactsByFunctionOrType } = this.props;
        functionOfContact.onChange(null);
        typeOfContact.onChange(null);
        keyword.onChange('');
        setContactsByFunctionOrType([]);
    }

    _associateContacts() {
        const { groupsFavoriteContacts, associateContactsByFunctionOrType, isOpen, swtShowMessage } = this.props;
        var list = groupsFavoriteContacts.get('contactByFunctionOrTypeSelected');
        if (_.size(_.filter(list, 'checked')) === 0) {
            swtShowMessage(MESSAGE_ERROR, 'Asociar contactos', 'Señor usuario, debe seleccionar al menos un contacto.');
        } else {
            if (_.size(_.filter(list, 'checked')) + _.size(groupsFavoriteContacts.get('group').get('listContact')) > MAXIMUM_NUMBER_OF_CONTACTS_FOR_GROUP) {
                swtShowMessage(MESSAGE_ERROR, 'Asociar contactos', 'Señor usuario, el número de contactos no puede superar los ' + MAXIMUM_NUMBER_OF_CONTACTS_FOR_GROUP + '.');
            } else {
                var contactsByFunctionOrTypeChecked = []
                list.map(item => {
                    if (item.checked) {
                        contactsByFunctionOrTypeChecked.push(_.omit(_.omit(item, "checked"), 'show'));
                    }
                });
                associateContactsByFunctionOrType(contactsByFunctionOrTypeChecked);
                swtShowMessage(MESSAGE_SUCCESS, 'Contactos asociados', 'Señor usuario, los contactos se han asociado exitosamente.');
                isOpen();
            }
        }
    }

    _handleSearchContacts() {
        const { fields: { functionOfContact, typeOfContact, keyword }, swtShowMessage,
            groupsFavoriteContacts, setContactsByFunctionOrType } = this.props;
        if (!stringValidate(typeOfContact.value) && !stringValidate(functionOfContact.value)) {
            swtShowMessage(MESSAGE_ERROR, 'Búsqueda de contactos', 'Señor usuario, debe seleccionar un tipo de contacto o una función.');
        } else {
            var list = groupsFavoriteContacts.get('contactByFunctionOrTypeSelected');
            var newList = _.filter(list, function (item) {
                return (item['completeName']).toUpperCase().includes((keyword.value).toUpperCase());
            });
            var filteredList = [];
            var listContacts = groupsFavoriteContacts.get('contactByFunctionOrTypeSelected');
            listContacts.map(contact => {
                if (_.isEmpty(_.filter(newList, ['id', parseInt(contact.id)]))) {
                    contact.show = false;
                } else {
                    contact.show = true;
                }
                filteredList.push(contact);
            });
            setContactsByFunctionOrType(filteredList);
        }
    }

    _getContactsByTypeOrFunction() {
        const { fields: { functionOfContact, typeOfContact, keyword }, getContactsByTypeOrFunction,
            swtShowMessage, setFunctionContactsByFunctionOrType, setTypeContactsByFunctionOrType,
            changeStateSaveData, pageNumContactsByFunctionOrType } = this.props;
        if (stringValidate(functionOfContact.value) || stringValidate(typeOfContact.value)) {
            pageNumContactsByFunctionOrType(FIRST_PAGE);
            const obj = {
                functions: stringValidate(functionOfContact.value) ? [functionOfContact.value] : null,
                typeOfContact: typeOfContact.value,
                keyword: keyword.value,
                pageNum: FIRST_PAGE,
                maxRows: NUMBER_RECORDS
            }
            setFunctionContactsByFunctionOrType(functionOfContact.value);
            setTypeContactsByFunctionOrType(typeOfContact.value);
            changeStateSaveData(true, MESSAGE_LOAD_DATA);
            getContactsByTypeOrFunction(obj).then((data) => {
                changeStateSaveData(false, "");
                if (!validateResponse(data)) {
                    swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                }
            }, (reason) => {
                changeStateSaveData(false, "");
                swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            });
        }
    }

    render() {
        const { fields: { functionOfContact, typeOfContact, keyword }, selectsReducer, groupsFavoriteContacts } = this.props;
        let visibleTable = "none";
        let visibleMessage = "block";
        if (_.size(groupsFavoriteContacts.get('contactByFunctionOrTypeSelected')) !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }
        return (
            <div>
                <div className="modalBt4-body modal-body"
                    style={{ overflowX: 'hidden', maxHeight: '490px !important' }}>
                    <Row>
                        <Col xs={5} sm={5} md={5} lg={5}>
                            <dt><span>Función</span></dt>
                            <dt style={{ paddingTop: "0px" }}>
                                <ComboBox
                                    name="functionOfContact"
                                    {...functionOfContact}
                                    labelInput="Seleccione..."
                                    valueProp={'id'}
                                    textProp={'value'}
                                    data={selectsReducer.get(FILTER_FUNCTION_ID) || []}
                                    onChange={val => this._getContactsByTypeOrFunction()}
                                />
                            </dt>
                        </Col>
                        <Col xs={5} sm={5} md={5} lg={5}>
                            <dt><span>Tipo</span></dt>
                            <dt style={{ paddingTop: "0px" }}>
                                <ComboBox
                                    name="typeOfContact"
                                    {...typeOfContact}
                                    labelInput="Seleccione..."
                                    valueProp={'id'}
                                    textProp={'value'}
                                    data={selectsReducer.get(FILTER_TYPE_CONTACT_ID) || []}
                                    onChange={val => this._getContactsByTypeOrFunction()}
                                />
                            </dt>
                        </Col>
                        <Col xs={1} sm={1} md={1} lg={1}>
                            <Tooltip text='Limpiar formulario'>
                                <button type="button" className="btn btn-primary" style={{ marginLeft: "20px", marginTop: "20px" }}
                                    onClick={this._onClickCleanForm}>
                                    <i style={{ color: "white", margin: '0em', fontSize: '1.2em' }}
                                        className="erase icon" />
                                </button>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <hr />
                        </Col>
                        <Col xs={11} sm={11} md={11} lg={11}>
                            <div className="InputAddOn">
                                <input type="text" style={{ padding: '0px 11px !important' }}
                                    name={"kewordContactByFunctionOrType"}
                                    placeholder="Buscar por nombre de contacto"
                                    {...keyword}
                                    value={keyword.value}
                                    onKeyPress={this._handleChangeKeyword}
                                    onChange={this._handleChangeKeyword}
                                    className="input-lg input InputAddOn-field" />
                                <Tooltip text='Buscar contacto'>
                                    <button id="searchClients" className="btn" type="button"
                                        onClick={this._handleSearchContacts} style={{ backgroundColor: "#E0E2E2", borderRadius: "0px 3px 3px 0px" }}>
                                        <i className="search icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                                    </button>
                                </Tooltip>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ display: visibleTable, width: "100%", height: "350px" }}>
                        <Col xs style={{ padding: '10px 0px 0 15px' }}>
                            <ListResultFuntionOrType />
                        </Col>
                    </Row>
                    <Row style={{ display: visibleMessage, width: "100%", textAlign: "center", height: "225px", paddingTop: "20px" }}>
                        <Col xs={12} sm={8} md={12} lg={12}>
                            <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span>
                        </Col>
                    </Row>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="button" className="btn btn-primary modal-button-edit" onClick={this._associateContacts}>
                        Asociar
                    </button>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getMasterDataFields,
        getContactsByTypeOrFunction,
        swtShowMessage,
        changeStateSaveData,
        associateContactsByFunctionOrType,
        setFunctionContactsByFunctionOrType,
        setTypeContactsByFunctionOrType,
        setKeywordContactsByFunctionOrType,
        pageNumContactsByFunctionOrType,
        setContactsByFunctionOrType
    }, dispatch);
}

function mapStateToProps({ selectsReducer, groupsFavoriteContacts }, ownerProps) {
    return {
        selectsReducer,
        groupsFavoriteContacts
    };
}

export default reduxForm({
    form: 'modalAddByFunctionOrType',
    fields
}, mapStateToProps, mapDispatchToProps)(ModalAddByFunctionOrType);

