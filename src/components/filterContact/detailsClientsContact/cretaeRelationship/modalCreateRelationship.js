import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import SweetAlert from '../../../sweetalertFocus';
import { bindActionCreators } from 'redux';
import { Col, Row } from 'react-flexbox-grid';
import $ from 'jquery';
import _ from 'lodash';

import MultipleSelect from '../../../../ui/multipleSelect/multipleSelectComponent';
import ComboBox from '../../../../ui/comboBox/comboBoxComponent';
import ComboBoxFilter from '../../../../ui/comboBoxFilter/comboBoxFilter';
import ListCreateRelationship from './listCreateRelationship';
import Tooltip from '../../../toolTip/toolTipComponent';
import ElementsComponent from '../../../elements';
import { swtShowMessage } from '../../../sweetAlertMessages/actions';

import { getContactDetails } from '../../../contact/contactDetail/actions';
import { changeStateSaveData } from '../../../main/actions';
import { clientsByEconomicGroup, modifyClientRelationship, updateRelationshipClientcontact } from '../../actions';
import { redirectUrl } from '../../../globalComponents/actions';
import { economicGroupsByKeyword } from '../../../selectsComponent/actions';
import { clientsFindServer } from '../../../clients/actions';
import { formValidateKeyEnter } from '../../../../actionsGlobal';
import { cleanList, addToList, createList } from '../../../elements/actions';

import { OBJECTIVES_PLACEHOLDER, OBJECTIVES, OBJECTIVES_OPEN_ERROR_MSG, MANDATORY_OBJECTIVES_MSG } from '../../../participants/constants';
import { OPEN_CREATE_MODAL } from '../../constants';
import { FILTER_FUNCTION_ID, FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LBO_ID } from '../../../selectsComponent/constants';
import { MESSAGE_SAVE_DATA, OPTION_REQUIRED } from '../../../../constantsGlobal';

import { schema as schemaObjectivesInterlocutor } from '../../../participants/schema'; 

const fields = ["contactTypeOfContact", "contactFunctions", "contactLineOfBusiness", "idClient", "nameClient",
    "groupEconomic", "economicGroupName"];
var clients = [];
var document;
var economicGroup;
var accountManager;
var access;
var thisForm;
const validate = (values) => {
    const errors = {};
    errors.contactTypeOfContact = !values.contactTypeOfContact ? OPTION_REQUIRED : null;
    errors.contactFunctions = !values.contactFunctions ? OPTION_REQUIRED : null;
    return errors;
}

export class ModalCreateRelationship extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showErrorForm: false,
            updating: true,
            title: "",
            typeView: "success",
            message: "",
            uploadTable: false
        };
        this.handleSubmitRelationship = this.handleSubmitRelationship.bind(this);
        this.closeAlertInformation = this.closeAlertInformation.bind(this);
        this.addClientToRelationship = this.addClientToRelationship.bind(this);
        this.updateKeyValueClient = this.updateKeyValueClient.bind(this);
        this.updateKeyValueEconomicGroup = this.updateKeyValueEconomicGroup.bind(this);
        this.addClientsEconomicToRelationship = this.addClientsEconomicToRelationship.bind(this);
        thisForm = this;
    }

    componentWillMount() {
        const { dispatchCreateList, dispatchCleanList } = this.props;

        dispatchCleanList(OBJECTIVES);
        dispatchCreateList(OBJECTIVES);
    }

    saveData = async (json) => {
        const { dispatchChangeStateSaveData, dispatchUpdateRelationshipClientContact, dispatchGetContactDetails } = this.props;

        dispatchChangeStateSaveData(true, MESSAGE_SAVE_DATA);

        const response = await dispatchUpdateRelationshipClientContact(json);
        dispatchChangeStateSaveData(false, "");

        if (!_.get(response, 'payload.data.validateLogin')) {
            redirectUrl("/login");
        } else {
            if (_.get(response, 'payload.data.status') === 200) {
                this.setState({
                    showErrorForm: true,
                    typeView: "success",
                    title: "Crear relación(es)",
                    message: "Señor usuario, las relaciones cliente-contacto se crearon correctamente."
                });
                dispatchGetContactDetails(window.sessionStorage.getItem('idContactSelected'));
            } else {
                this.setState({
                    showErrorForm: true,
                    typeView: "error",
                    title: "Error",
                    message: "Señor usuario, ocurrió un error tratando de actualizar la información."
                });
            }
        }
    }

    handleSubmitRelationship = () => {
        const { 
            fields: { contactTypeOfContact, contactFunctions, contactLineOfBusiness },
            filterContactsReducer, elementsReducer, dispatchSwtShowMessage
        } = this.props; 

        if (filterContactsReducer.get('clientsCreaterRelationship').length > 0) {

            const data = elementsReducer[OBJECTIVES];

            if (data && data.open) {
                dispatchSwtShowMessage('error', 'Error', OBJECTIVES_OPEN_ERROR_MSG);
                return;
            }

            const idValuesClients = _.map(filterContactsReducer.get('clientsCreaterRelationship'), 'id');
            const json = {
                "idClientContact": null,
                "clients": JSON.parse('[' + idValuesClients + ']'),
                "idContact": window.sessionStorage.getItem('idContactSelected'),
                "typeOfContact": contactTypeOfContact.value !== undefined ? contactTypeOfContact.value : null,
                "function": JSON.parse('[' + ((contactFunctions.value) ? contactFunctions.value : "") + ']'),
                "lineOfBusiness": JSON.parse('[' + ((contactLineOfBusiness.value) ? contactLineOfBusiness.value : "") + ']'),
                "interlocutorObjs": data.elements
            };
            this.saveData(json);
        } else {
            this.setState({
                showErrorForm: true,
                title: "Error creando relaciones",
                typeView: "error",
                message: "Señor usuario, para crear relaciones cliente-contacto primero debe agregar como mínimo un cliente."
            });
        }

    }

    closeAlertInformation = () => {
        this.setState({ showErrorForm: false });
        if (_.isEqual(this.state.typeView, "success", false)) {
            const { functionClose } = this.props;
            functionClose(OPEN_CREATE_MODAL);
        }
    }

    updateKeyValueClient(e) {
        const { fields: { idClient, nameClient }, dispatchClientsFindServer } = this.props;
        if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
            e.consultclick ? "" : e.preventDefault();
            if (nameClient.value !== "" && nameClient.value !== null && nameClient.value !== undefined && nameClient.value.length >= 3) {
                $('.ui.search.clientRelationship').toggleClass('loading');
                dispatchClientsFindServer(nameClient.value, 0, 150, "", "", "").then((data) => {
                    clients = _.get(data, 'payload.data.data.rows', []);
                    $('.ui.search.clientRelationship')
                        .search({
                            cache: false,
                            source: clients,
                            maxResults: 1500,
                            searchFields: [
                                'title',
                                'description',
                                'id',
                            ],
                            onSelect: function (event) {
                                nameClient.onChange(event.name);
                                idClient.onChange(event.id);
                                document = event.document;
                                accountManager = event.accountManager;
                                economicGroup = event.economicGroup;
                                access = event.access;
                                return 'default';
                            }
                        });
                    $('.ui.search.clientRelationship').toggleClass('loading');
                    setTimeout(function () {
                        $('#clientRelationship').focus();
                    }, 150);
                });
            } else {
                this.setState({
                    showErrorForm: true,
                    title: "Error de búsqueda",
                    typeView: "error",
                    message: "Señor usuario, para realizar la búsqueda de clientes debe ingresar por lo menos tres caracteres."
                });
            }
        }
    }

    updateKeyValueEconomicGroup(e) {
        const { fields: { groupEconomic, economicGroupName }, dispatchEconomicGroupsByKeyword } = this.props;
        groupEconomic.onChange('');
        if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
            e.consultclick ? "" : e.preventDefault();
            if (economicGroupName.value !== "" && economicGroupName.value !== null && economicGroupName.value !== undefined && economicGroupName.value.length >= 3) {
                $('.ui.search.economicGroup').toggleClass('loading');
                dispatchEconomicGroupsByKeyword(economicGroupName.value).then((data) => {
                    let economicGroup1 = _.get(data, 'payload.data.data');
                    let economicGroup2 = _.forEach(economicGroup1, function (data1) {
                        data1.title = data1.group;
                        data1.description = data1.nitPrincipal != null ? data1.nitPrincipal : '';
                    });
                    $('.ui.search.economicGroup')
                        .search({
                            cache: false,
                            source: economicGroup1,
                            searchFields: [
                                'title',
                                'description',
                                'id'
                            ],
                            onSelect: function (event) {
                                economicGroupName.onChange(event.group);
                                groupEconomic.onChange(event.id);
                                return 'default';
                            }
                        });
                    $('.ui.search.economicGroup').toggleClass('loading');
                    setTimeout(function () {
                        $('#economicGroup').focus();
                    }, 150);
                });
            } else {
                this.setState({
                    showErrorForm: true,
                    title: "Error de búsqueda",
                    typeView: "error",
                    message: "Señor usuario, para realizar la búsqueda de un grupo económico debe ingresar por lo menos tres caracteres."
                });
            }
        }
    }


    addClientToRelationship() {
        const { fields: { idClient, nameClient } } = this.props;
        if (_.isUndefined(idClient.value) || _.isNull(idClient.value) || idClient.value === "") {
            this.setState({
                showErrorForm: true,
                title: "Error agregando cliente",
                typeView: "error",
                message: "Señor usuario, para agregar un cliente a la relación primero debe buscarlo."
            });
        } else {
            if (access) {
                const { fields: { idClient }, modifyClientRelationship, filterContactsReducer, contactDetail } = this.props;
                const idClientsRelationshipSaved = _.map(contactDetail.get('listClientcontacts'), 'idClient');
                const indexClient = _.indexOf(idClientsRelationshipSaved, idClient.value);
                if (indexClient < 0) {
                    var arrayClients = filterContactsReducer.get('clientsCreaterRelationship');
                    const indexClient = _.indexOf(_.map(arrayClients, 'id'), idClient.value);
                    if (indexClient < 0) {
                        const jsonClient = {
                            id: idClient.value,
                            document: document,
                            nameClient: nameClient.value,
                            economicGroup: economicGroup,
                            accountManager: accountManager
                        };
                        arrayClients.push(jsonClient);
                        modifyClientRelationship(arrayClients, !filterContactsReducer.get('uploadTable'));
                        this.setState({ uploadTable: !this.state.uploadTable });
                        idClient.onChange('');
                        nameClient.onChange('');
                        document = null;
                        economicGroup = null;
                        accountManager = null;
                    } else {
                        this.setState({
                            showErrorForm: true,
                            typeView: "error",
                            title: "Error creando relación",
                            message: "Señor usuario, el cliente que quiere agregar ya se encuentra en la lista de relaciones."
                        });
                    }
                } else {
                    this.setState({
                        showErrorForm: true,
                        typeView: "error",
                        title: "Error agregando cliente",
                        message: "Señor usuario, el cliente que quiere agregar ya tiene relación con el contacto."
                    });
                }
            } else {
                this.setState({
                    showErrorForm: true,
                    typeView: "error",
                    title: "Error creando relación",
                    message: "Señor usuario, no puede relacionar el cliente porque no pertenece a una de sus células."
                });
            }
        }
    }

    addClientsEconomicToRelationship() {
        const { fields: { groupEconomic, economicGroupName }, dispatchClientsByEconomicGroup, filterContactsReducer,
            contactDetail, modifyClientRelationship } = this.props;
        if (_.isUndefined(groupEconomic.value) || _.isNull(groupEconomic.value) || groupEconomic.value === "") {
            this.setState({
                showErrorForm: true,
                title: "Error agregando clientes",
                typeView: "error",
                message: "Señor usuario, debe buscar y seleccionar un grupo económico."
            });
        } else {
            dispatchClientsByEconomicGroup(groupEconomic.value).then((data) => {
                if (_.get(data, 'payload.data.status') === 200) {
                    var valuesServer = _.get(data, 'payload.data.data');
                    var valuesAdd = filterContactsReducer.get('clientsCreaterRelationship');

                    //Elimino los clientes que ya tiene una relación con el contacto
                    _.map(contactDetail.get('listClientcontacts'), map => {
                        _.remove(valuesServer, (val) => val.id === map.idClient)
                    });

                    //Elimino los clientes que están en la lista para crear una relación con el contacto
                    _.map(valuesAdd, map => {
                        _.remove(valuesServer, (val) => val.id === map.id)
                    });

                    //Valido si hay algún cliente del grupo económico que no tenga relación, ni este en la lista de creación
                    if (valuesServer.length <= 0) {
                        this.setState({
                            showErrorForm: true,
                            title: "Error agregando clientes",
                            typeView: "error",
                            message: "Señor usuario, los clientes que pertenecen al grupo económico ya tienen una relación con el contacto o no pertenece a una de sus células."
                        });
                    } else {
                        _.map(valuesServer, (map) => valuesAdd.push(map));
                        modifyClientRelationship(valuesAdd, !filterContactsReducer.get('uploadTable'));
                        groupEconomic.onChange('');
                        economicGroupName.onChange('');
                        this.setState({ uploadTable: !this.state.uploadTable });
                    }
                } else {
                    this.setState({
                        showErrorForm: true,
                        title: "Error consultando grupos económicos",
                        typeView: "error",
                        message: "Señor usuario, ocurrió un error tratando de consultar los grupos económicos."
                    });
                }
            })
                .catch(err => {
                    this.setState({
                        showErrorForm: true,
                        title: "Error consultando grupos económicos",
                        typeView: "error",
                        message: "Señor usuario, ocurrió un error tratando de consultar los grupos económicos."
                    });
                });
        }
    }


    render() {
        const { fields: { contactTypeOfContact, contactFunctions, contactLineOfBusiness, nameClient, economicGroupName },
            handleSubmit, filterContactsReducer, selectsReducer, functionClose, reducerGlobal } = this.props;
        return (
            <div className="modalBt4-dialog modalBt4-lg0" style={{ width: '70%' }}>
                <div className="modalBt4-content modal-content">
                    <div className="modalBt4-header modal-header">
                        <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Crear relación cliente-contacto</h4>
                        <button name='btnClose' type="button" onClick={() => { functionClose(OPEN_CREATE_MODAL) }} className="close" data-dismiss="modal" role="close">
                            <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(this.handleSubmitRelationship)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}>
                        <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{ overflowX: 'hidden' }}>
                            <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Clasificación del contacto</span></dt>
                            <Row style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                                <Col xs={12} md={6} lg={4}>
                                    <dt><span>Tipo de contacto (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd>
                                        <ComboBox
                                            name="contactTypeOfContact"
                                            labelInput="Seleccione"
                                            {...contactTypeOfContact}
                                            valueProp={'id'}
                                            textProp={'value'}
                                            data={selectsReducer.get(FILTER_TYPE_CONTACT_ID) || []}
                                        />
                                    </dd>
                                </Col>
                                <Col xs={12} md={6} lg={4}>
                                    <dt><span>Entidad/Línea de negocio</span></dt>
                                    <dd>
                                        <MultipleSelect
                                            name="contactLineOfBusiness"
                                            labelInput="Seleccione"
                                            {...contactLineOfBusiness}
                                            valueProp={'id'}
                                            textProp={'value'}
                                            data={selectsReducer.get(FILTER_TYPE_LBO_ID) || []}
                                        />
                                    </dd>
                                </Col>
                                <Col xs={12} md={6} lg={4}>
                                    <dt><span>Función (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd>
                                        <MultipleSelect
                                            name="contactFunctions"
                                            labelInput="Seleccione"
                                            {...contactFunctions}
                                            valueProp={'id'}
                                            textProp={'value'}
                                            data={selectsReducer.get(FILTER_FUNCTION_ID) || []}
                                        />
                                    </dd>
                                </Col>
                                <Row style={{ padding: "20px 0px 20px 10px", marginTop: 20, width:'100%' }}>
                                    <Col xs={12} md={12} lg={12}>
                                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                                            <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                                            <i className="browser icon" style={{ fontSize: "20px" }} />
                                            <span style={{ fontSize: "20px" }}>{`Objetivos del interlocutor`}</span>

                                            <Tooltip text={MANDATORY_OBJECTIVES_MSG}>
                                                <i className="help circle icon blue" style={{ fontSize: "16px", cursor: "pointer", marginLeft: "10px" }} />
                                            </Tooltip>

                                        </div>
                                    </Col>
                                    <Col style={{ marginTop: '-50px' }} xs={12} md={12} lg={12}>
                                        <ElementsComponent 
                                            schema={schemaObjectivesInterlocutor} 
                                            placeholder={OBJECTIVES_PLACEHOLDER} 
                                            messageButton='Agregar' 
                                            name={OBJECTIVES} 
                                            max={3} 
                                            title={'Objetivos del interlocutor'} 
                                            isEditable={true}
                                            singularTitle={'el objetivo del interlocutor'}
                                        />
                                    </Col>
                                </Row>
                            </Row>
                            <dt className="business-title" style={{ marginTop: '-70px' }}>
                                <span style={{ paddingLeft: '20px' }}>Búsqueda de clientes</span>
                            </dt>
                            <Row style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                                <Col xs={12} md={4} lg={4}>
                                    <dt><span>Cliente </span></dt>
                                    <dd>
                                        <div className="ui dropdown search clientRelationship fluid" style={{ border: "0px", zIndex: "1", padding: "0px" }}>
                                            <ComboBoxFilter className="prompt" id="clientRelationship" idIcon="iconClientRelationship"
                                                style={{ borderRadius: "3px" }}
                                                autoComplete="off"
                                                type="text"
                                                {...nameClient}
                                                value={nameClient.value}
                                                placeholder="Ingrese un criterio de búsqueda..."
                                                onKeyPress={this.updateKeyValueClient}
                                                touched={true}
                                            />
                                        </div>
                                    </dd>
                                </Col>
                                <Col xs={12} md={2} lg={2} >
                                    <button className="btn btn-primary" type="button" onClick={this.addClientToRelationship}
                                        style={{ cursor: 'pointer', marginTop: '35px' }}>
                                        <i className="plus icon"></i> Agregar
                                    </button>
                                </Col>
                                <Col xs={12} md={6} lg={3} >
                                    <dt><span>Grupo económico</span></dt>
                                    <dd>
                                        <div className="ui search economicGroup fluid">
                                            <ComboBoxFilter className="prompt" id="economicGroup" idIcon="iconEconomicGroup"
                                                style={{ borderRadius: "3px" }}
                                                autoComplete="off"
                                                type="text"
                                                {...economicGroupName}
                                                value={economicGroupName.value}
                                                placeholder="Ingrese un criterio de búsqueda..."
                                                onKeyPress={this.updateKeyValueEconomicGroup}
                                                touched={true}
                                            />
                                        </div>
                                    </dd>
                                </Col>
                                <Col xs={12} md={3} lg={3} >
                                    <button className="btn btn-primary" type="button" onClick={this.addClientsEconomicToRelationship}
                                        style={{ cursor: 'pointer', marginTop: '35px' }}>
                                        <i className="plus icon"></i> Agregar clientes
                                    </button>
                                </Col>
                            </Row>
                            {filterContactsReducer.get('clientsCreaterRelationship').length > 0 ?
                                <ListCreateRelationship uploadTable={this.state.uploadTable} />
                                :
                                <Row>
                                    <Col xs={12} md={12} lg={12}>
                                        <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "20px" }}>
                                            <span className="form-item">No hay clientes asociados a la relación</span>
                                        </div>
                                    </Col>
                                </Row>
                            }
                        </div>
                        <div className="modalBt4-footer modal-footer">
                            <button
                                type="submit"
                                className="btn btn-primary modal-button-edit"
                            >{'Guardar'}</button>
                        </div>
                    </form>
                </div>
                <SweetAlert
                    type={this.state.typeView}
                    show={this.state.showErrorForm}
                    title={this.state.title}
                    text={this.state.message}
                    onConfirm={this.closeAlertInformation}
                />
            </div>
        )
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchAddToList: addToList,
        dispatchCreateList: createList,
        dispatchCleanList: cleanList,
        dispatchUpdateRelationshipClientContact: updateRelationshipClientcontact,
        dispatchChangeStateSaveData: changeStateSaveData,
        dispatchGetContactDetails: getContactDetails,
        dispatchClientsFindServer: clientsFindServer,
        dispatchEconomicGroupsByKeyword: economicGroupsByKeyword,
        dispatchClientsByEconomicGroup: clientsByEconomicGroup,
        dispatchSwtShowMessage: swtShowMessage
    }, dispatch);
}

function mapStateToProps({ filterContactsReducer, reducerGlobal, contactDetail, selectsReducer, elementsReducer }) {
    return {
        filterContactsReducer,
        reducerGlobal,
        contactDetail,
        selectsReducer,
        modifyClientRelationship,
        elementsReducer
    };
}

export default reduxForm({
    form: 'validationCreateRelationship',
    fields,
    validate,
    onSubmitFail: () => {
        thisForm.setState({
            showErrorForm: true,
            typeView: "error",
            title: "Campos obligatorios",
            message: "Señor usuario, para crear relaciones cliente-contacto debe ingresar los campos obligatorios."
        });
    }
}, mapStateToProps, mapDispatchToProps)(ModalCreateRelationship);