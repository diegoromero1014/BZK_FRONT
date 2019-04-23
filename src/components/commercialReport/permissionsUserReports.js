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
import { addUsers, clearUsers, filterUsers, setConfidential } from './actions';
import { contactsByClientFindServer } from '../contact/actions';
import { validateValue, validateIsNullOrUndefined } from '../../actionsGlobal';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import SweetAlert from '../sweetalertFocus';
import { showBrandConfidential } from '../navBar/actions';


import { NUMBER_CONTACTS, MESSAGE_CONFIDENTIAL, TITLE_MESSAGE_ERR_USER_INVALID, MESSAGE_ERR_USER_INVALID } from './constants';

import '../../../styles/modules/UserPermissions/Checkbox.scss'


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
            isConfidencial: null,
            showEmptyParticipantBanco: false,
            showParticipantExistBanco: false,
            validateConsultParticipants: false,
            showInvalidCharacter: false,
            showMessage: null,
            userSelected: false
        }

        this._addUser = this._addUser.bind(this);
        this._updateValue = this._updateValue.bind(this);
        this.updateKeyValueUsers = this.updateKeyValueUsers.bind(this);
        this._handleChangeUserPermission = this._handleChangeUserPermission.bind(this);
        this.getIsConfidential = this.getIsConfidential.bind(this);
        this.cancelAlert = this.cancelAlert.bind(this);
        this.validateUser = this.validateUser.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.confidentialBrand = this.confidentialBrand.bind(this);
    }

    _addUser() {
        const { fields: { idUser, nameUser, description, cargoUsuario, empresaUsuario }, usersPermission, addUsers, swtShowMessage } = this.props;
        if (validateValue(description.value) && validateValue(nameUser.value) && !(validateIsNullOrUndefined(idUser.value) || idUser.value <= 0)) {
            this.validateUser(nameUser.value).then(() => {
                if (this.state.userSelected) {
                    let userTODO = usersPermission.find(function (item) {
                        if (item.user.id === idUser.value) {
                            return item.user.id;
                        }
                    });
    
                    if (description.value === window.localStorage.getItem('userNameFront')) {
                        userTODO = idUser.value;
                    }
    
                    if (userTODO === undefined) {
                        let user = {
                            id: null,
                            commercialReport: null,
                            user: {
                                id: idUser.value,
                                username: description.value,
                                name: nameUser.value
                            }
                        }
    
                        addUsers(user);
                        idUser.onChange('');
                        nameUser.onChange('');
                        description.onChange('');
                    } else {
                        swtShowMessage('error', "Usuario existente", "Señor usuario, el usuario que desea agregar ya se encuentra en la lista o es el creador de este documento comercial.");
                    }

                    this.setState({userSelected: false });
                } else {
                    swtShowMessage('error', TITLE_MESSAGE_ERR_USER_INVALID, MESSAGE_ERR_USER_INVALID);
                }
            }).catch(() => {
                swtShowMessage('error', TITLE_MESSAGE_ERR_USER_INVALID, MESSAGE_ERR_USER_INVALID);
            });
        } else {
            swtShowMessage('error', "Error usuario", "Señor usuario, para agregar un participante debe seleccionar un usuario");
        }
    }

    _handleChangeUserPermission() {
        const { clearUsers, setConfidential, showBrandConfidential } = this.props;
        const isConfidencial = !this.getIsConfidential();

        this.setState({ isConfidencial: isConfidencial });

        if (!isConfidencial) {
            this.setState({
                showMessage: false
            });

            clearUsers();
            setConfidential(false);
            showBrandConfidential(false);
        } else {
            this.setState({
                showMessage: true
            });
        }
    }

    _updateValue(value) {
        const { fields: { idUser, nameUser, description, cargoUsuario }, contactsByClient } = this.props;
        idUser.onChange(value);
        nameUser.onChange(value)
        description.onChange(value)
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

    handleOnSelect(event) {
        this.setState({userSelected: true});

        const { fields: { userObject, nameUser, idUser, cargoUsuario, description } } = this.props;

        description.onChange(event.description);
        userObject.onChange(event);
        nameUser.onChange(event.title);
        idUser.onChange(event.idUsuario);
        cargoUsuario.onChange(event.cargo);
        return 'default';
    }

    updateKeyValueUsers(e) {
        self = this;

        const { fields: { nameUser }, filterUsers, swtShowMessage } = this.props;

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
                            onSelect: self.handleOnSelect
                        });
                    $('.ui.search.userPermissions').toggleClass('loading');

                    $('#inputUserPermissions').focus();
                });
            } else if (nameUser.value.length <= 3) {
                swtShowMessage('error', 'Error', 'Señor usuario, para realizar la búsqueda es necesario ingresar al menos 3 caracteres');
            }
        }
    }

    getIsConfidential() {
        const { confidentialReducer } = this.props;
        const confidential = confidentialReducer.get("confidential");

        if (this.state.isConfidencial !== null) {
            return this.state.isConfidencial;
        }

        return confidential;
    }

    confidentialBrand() {
        const { confidentialReducer, showBrandConfidential } = this.props;

        let confidential = confidentialReducer.get('confidential');

        if (confidential) {
            showBrandConfidential(confidential);
        }
    }

    cancelAlert() {
        const { setConfidential, showBrandConfidential } = this.props;

        this.setState({
            showMessage: false,
            isConfidencial: false
        });

        setConfidential(false);
        showBrandConfidential(false);
    }

    validateUser(name) {
        const { filterUsers } = this.props;

        return new Promise((resolve, reject) => {
            if (name) {
                filterUsers(name).then(data => {
                    const user = _.get(data, 'payload.data.data');
    
                    if (Array.isArray(user) && !user.length) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            }
        })
    }

    handleOnChange(value) {
        const { fields: { nameUser } } = this.props;
        nameUser.onChange(value);

        this.setState({ userSelected: false });
    }

    render() {
        const { fields: { nameUser }, usersPermission, disabled, setConfidential, showBrandConfidential } = this.props;

        const isConfidential = this.getIsConfidential();
        this.confidentialBrand();

        var numColumnList = 6;
        var data = _.chain(usersPermission.toArray()).map(usersPermission => {
            return usersPermission;
        }).value();

        if (data.length === 10) {
            disabledButtonCreate = 'disabled';
        } else {
            disabledButtonCreate = '';
        }
        if (disabled === "disabled") {
            numColumnList = 12;
        }

        return (
            <div>
                <div>
                    <Col xs={12} sm={12} md={3} lg={3}>
                        <Tooltip text="Marcar este informe como confidencial">
                            <Checkbox
                                id="checkbox-permmissions"
                                className="checkbox-permmissions"
                                readOnly={disabled}
                                onClick={this._handleChangeUserPermission}
                                label={'Marcar como confidencial'}
                                style={{ padding: "15px 10px 0px 20px" }}
                                checked={isConfidential}
                                disabled={disabled}
                                toggle
                            />
                        </Tooltip>
                    </Col>
                </div>
                {isConfidential ?
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
                            {disabled === '' || disabled === undefined ?
                                <Col xs={12} md={6} lg={6} style={{ paddingRight: "20px" }}>
                                    <Col xs={12} md={12} lg={12}>
                                        <dt><span>Usuario: </span></dt>
                                        <dt>
                                            <div className="ui dropdown search userPermissions fluid" style={{ border: "0px", zIndex: "1", padding: "0px" }}>
                                                <ComboBoxFilter
                                                    name='inputUserPermissions'
                                                    placeholder='Ingrese un criterio de busqueda...'
                                                    {...nameUser}
                                                    parentId='dashboardComponentScroll'
                                                    value={nameUser.value}
                                                    onChange={value => this.handleOnChange(value)}
                                                    onKeyPress={this.updateKeyValueUsers}
                                                    onSelect={val => this._updateValue(val)}
                                                    max="30"
                                                    id="inputUserPermissions"
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
                                : ''}
                            {data.length > 0 ?
                                <Col xs={12} md={numColumnList} lg={numColumnList}>
                                    <ListUserPermissions disabled={disabled} />
                                </Col>
                                :
                                <Col xs={12} md={numColumnList} lg={numColumnList}>
                                    <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                        <span className="form-item">Aún no se han adicionado usuarios</span>
                                    </div>
                                </Col>
                            }
                        </Row>
                    </div>
                    : <div></div>
                }

                <SweetAlert
                    type="warning"
                    show={this.state.showMessage}
                    title="¡Advertencia!"
                    text={MESSAGE_CONFIDENTIAL}
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='¡Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={this.cancelAlert}
                    onConfirm={() => {
                            this.setState({ showMessage: false });
                            setConfidential(true);
                            showBrandConfidential(true);
                        }
                    }
                />
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
        swtShowMessage,
        setConfidential,
        showBrandConfidential
    }, dispatch);
}

function mapStateToProps({ selectsReducer, usersPermission, contactsByClient, previsitReducer, confidentialReducer }) {
    return {
        usersPermission,
        selectsReducer,
        contactsByClient,
        previsitReducer,
        confidentialReducer
    };
}

export default reduxForm({
    form: 'submitValidation',
    fields: ["idUser", "nameUser", "cargoUsuario", "userObject", "description"],
    validate
}, mapStateToProps, mapDispatchToProps)(PermissionUserReports);