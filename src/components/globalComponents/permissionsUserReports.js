import React, { Component } from 'react';
import ListUserPermissions from './ListUserPermissions';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import $ from 'jquery';
import Tooltip from '../toolTip/toolTipComponent';
import ComboBoxFilter from "../../ui/comboBoxFilter/comboBoxFilter";
import { Checkbox } from 'semantic-ui-react';
import { addUsers, clearUsers, filterUsers } from './actions';
import { contactsByClientFindServer } from '../contact/actions';
import { validateValue, validateValueExist, validateIsNullOrUndefined } from '../../actionsGlobal';
import { swtShowMessage } from '../sweetAlertMessages/actions';

import { NUMBER_CONTACTS, KEY_PARTICIPANT_BANCO } from './constants';

var self;
const validate = values => {
    const errors = {}
    return errors
};


var disabledButtonCreate = '';
var usersPermission = [];

class PermissionUserReports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfidencial: false,
            showEmptyParticipantBanco: false,
            showParticipantExistBanco: false,
            validateConsultParticipants: false,
            showInvalidCharacter: false
        }

        this._addUser = this._addUser.bind(this);
        this._updateValue = this._updateValue.bind(this);
        this.updateKeyValueUsers = this.updateKeyValueUsers.bind(this);
        this._handleChangeUserPermission = this._handleChangeUserPermission.bind(this);
    }

    _addUser() {
        const { fields: { idUser, nameUser, cargoUsuario, empresaUsuario }, usersPermission, addUsers, swtShowMessage } = this.props;
        if (validateValue(nameUser.value) && !(validateIsNullOrUndefined(idUser.value) || idUser.value <= 0)) {
            var userTODO = usersPermission.find(function (item) {
                if (item.tipoParticipante === KEY_PARTICIPANT_BANCO) {
                    return item.idParticipante === idUser.value;
                }
            });

            if (userTODO === undefined) {
                //const uuid = _.uniqueId('participanBanco_');
                var user = {
                    idParticipante: idUser.value,
                    nombreParticipante: nameUser.value
                }
                console.log(user);
                addUsers(user);
                idUser.onChange('');
                nameUser.onChange('');
            } else {
                swtShowMessage('error', "Usuario existente", "Señor usuario, el usuario que desea agregar ya se encuentra en la lista");
            }
        } else {
            swtShowMessage('error', "Error usuario", "Señor usuario, para agregar un participante debe seleccionar un usuario");
        }
    }

    _handleChangeUserPermission(event) {
        this.setState({ isConfidencial: true });
        var isConf = this.state.isConfidencial;
        if (isConf !== false) {
            this.setState({ isConfidencial: false });
        }
    }

    _updateValue(value) {
        const { fields: { idUser, nameUser, cargoUsuario }, contactsByClient } = this.props;
        var contactClient = contactsByClient.get('contacts');
        var userSelected;

        _.map(contactClient, contact => {
            if (contact.id.toString() === value) {
                userSelected = contact;
                return contact;
            }
        });

        if (validateValue(userSelected)) {
            idUser.onChange(userSelected.id);
            nameUser.onChange(userSelected.nameComplet);
            cargoUsuario.onChange(userSelected.contactPosition);
        } else {
            if (idUser.value > 0) {
                idUser.onChange('');
            }
        }
    }

    componentWillMount() {
        const { clearUsers, contactsByClient, contactsByClientFindServer } = this.props;
        clearUsers();
        this.props.resetForm();
        const valuesContactsClient = contactsByClient.get('contacts');
        if (_.isEmpty(valuesContactsClient) || valuesContactsClient === null || valuesContactsClient === undefined) {
            contactsByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_CONTACTS, "", 0, "", "", "", "");
        }
    }

    componentDidMount() {
        self = this;
        $("#iconSearchUserPermissions").click(function () {
            var e = { keyCode: 13, consultclick: true };
            self.updateKeyValueUsersBanco(e);
        });
    }

    componentWillUpdate() {
        self = this;
        $("#iconSearchUserPermissions").click(function () {
            var e = { keyCode: 13, consultclick: true };
            self.updateKeyValueUsersBanco(e);
        });
    }

    updateKeyValueUsers(e) {
        const { fields: { nameUser, idUser, cargoUsuario }, filterUsers, swtShowMessage } = this.props;

        if (e.keyCode === 13 || e.which === 13) {
            e.consultclick ? "" : e.preventDefault();
            if (nameUser.value !== "" && nameUser.value.length >= 3 && nameUser.value !== null && nameUser.value !== undefined) {
                $('.ui.search.userPermissions').toggleClass('loading');
                filterUsers(nameUser.value).then((data) => {
                    usersPermission = _.get(data, 'payload.data.data');
                    $('.ui.search.userPermissions')
                        .search({
                            cache: false,
                            source: usersPermission,
                            maxResults: 1500,
                            searchFields: [
                                'title',
                                'description',
                                'idUsuario',
                                'cargo'
                            ],
                            onSelect: function (event) {
                                nameUser.onChange(event.title);
                                idUser.onChange(event.idUsuario);
                                cargoUsuario.onChange(event.cargo);
                                return 'default';
                            }
                        });
                    $('.ui.search.userPermissions').toggleClass('loading');
                    // setTimeout(function () {
                    //     $('#inputUserPermissions').focus();
                    // }, 150);
                });
            } else {
                if (nameUser.value.length <= 3) {
                    swtShowMessage('error', 'Error', 'Señor usuario, para realizar la búsqueda es necesario ingresar al menos 3 caracteres');
                }
            }
        }
    }

    render() {
        const { fields: { nameUser }, disabled } = this.props;
        var numColumnList = 6;

        return (
            <div>
                <div>
                    <Col xs={12} sm={12} md={3} lg={3}>
                        <Tooltip text="Marcar este informe como confidencial">
                            <Checkbox
                                onClick={this._handleChangeUserPermission}
                                label={<label>Marcar como confidencial</label>}
                                style={{ padding: "15px 10px 0px 20px" }} slider />
                        </Tooltip>
                    </Col>
                </div>
                {this.state.isConfidencial ?
                    <div>
                        <Row style={{ padding: "10px 10px 20px 20px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                                    <div className="tab-content-row"
                                        style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                                    <i className="user icon" style={{ fontSize: "20px" }} />
                                    <span style={{ fontSize: "20px" }}> Usuarios permitidos</span>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ padding: "0px 10px 0px 20px" }}>
                            <Col xs={12} md={6} lg={6} style={{ paddingRight: "20px" }}>
                                <Col xs={12} md={12} lg={12}>
                                    <dt><span>Nombre: </span></dt>
                                    <dt>
                                        <div className="ui dropdown search userPermissions fluid" style={{ border: "0px", zIndex: "1", padding: "0px" }}>
                                            <ComboBoxFilter
                                                name='inputUserPermissions'
                                                placeholder='Ingrese un criterio de busqueda...'
                                                {...nameUser}
                                                parentId='dashboardComponentScroll'
                                                value={nameUser.value}
                                                onChange={nameUser.onChange}
                                                onKeyPress={this.updateKeyValueUsers}
                                                onSelect={val => this._updateValue(val)}
                                                max="30"
                                            />
                                        </div>
                                    </dt>
                                </Col>
                                <Row style={{ paddingLeft: "10px" }}>
                                    <Col xs={12} md={5} lg={5}>
                                        <button className='btn btn-primary' onClick={this._addUser}
                                            type='button' title='Adicionar participantes, maximo 10' style={{ marginTop: "20px" }}>
                                            <i className="white plus icon" />Agregar Usuario</button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} md={numColumnList} lg={numColumnList} style={{ paddingLeft: "5px", paddingTop: "10px" }}>
                                <ListUserPermissions disabled={disabled} />
                            </Col>
                        </Row>
                    </div>
                    : <div></div>}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addUsers,
        clearUsers,
        contactsByClientFindServer,
        filterUsers,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ selectsReducer, usersPermission, contactsByClient }) {
    return {
        usersPermission,
        selectsReducer,
        contactsByClient
    };
}

export default reduxForm({
    form: 'submitValidation',
    fields: ["idUser", "nameUser", "cargoUsuario"],
    validate
}, mapStateToProps, mapDispatchToProps)(PermissionUserReports);