import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    clientsFindServer, clearClients, changePage, changeKeyword, getRecentClients,
    deleteAllRecentClients
} from './actions';
import ClientListItem from './clientListItem';
import SearchBarClient from './searchBarClient';
import { NUMBER_RECORDS, ID_OPTION_ALL_LEVEL_AEC, AEC_NO_APLICA } from './constants';
import Pagination from './pagination';
import { redirectUrl } from '../globalComponents/actions';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import { consultList, getMasterDataFields } from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import { reduxForm } from 'redux-form';
import { updateTitleNavBar } from '../navBar/actions';
import { clearContact } from '../contact/actions';
import { clearInfoClient } from '../clientInformation/actions';
import {
    SESSION_EXPIRED, MODULE_PROSPECT, MODULE_CLIENTS, VISUALIZAR, CREAR, MESSAGE_LOAD_DATA,
    TAB_RISKS_MANAGEMENT, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT
} from '../../constantsGlobal';
import { validatePermissionsByModule, validateResponse } from '../../actionsGlobal';
import { updateTabSeleted } from '../clientDetailsInfo/actions';
import { updateTabSeletedRisksManagment } from '../risksManagement/actions';
import { TAB_AEC } from '../risksManagement/constants';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { changeStateSaveData } from '../dashboard/actions';
import Tooltip from '../toolTip/toolTipComponent';
import SweetAlert from 'sweetalert-react';

const fields = ["team", "certificationStatus", "linkedStatus", "levelAEC"];
var levelsAEC;

class ClientsFind extends Component {
    constructor(props) {
        super(props);
        this._onChangeTeam = this._onChangeTeam.bind(this);
        this._onChangeLinkedStatus = this._onChangeLinkedStatus.bind(this);
        this._onChangeCertificationStatus = this._onChangeCertificationStatus.bind(this);
        this._onChangeLevelAEC = this._onChangeLevelAEC.bind(this);
        this._clickButtonCreateProps = this._clickButtonCreateProps.bind(this);
        this._handleClientsFind = this._handleClientsFind.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
        this._deleteAllRecentClientes = this._deleteAllRecentClientes.bind(this);
        this.state = {
            valueTeam: "",
            valueCertification: "",
            showConfirmDeleteRecentClientes: false
        }
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined) {
            redirectUrl("/login");
        } else {
            const { clearClients, consultList, getMasterDataFields, clearContact, clearInfoClient,
                updateTitleNavBar, validatePermissionsByModule, selectsReducer, updateTabSeleted,
                updateTabSeletedRisksManagment, getRecentClients, swtShowMessage, changeStateSaveData } = this.props;
            changeStateSaveData(true, MESSAGE_LOAD_DATA);
            clearClients();
            updateTabSeleted(null);
            updateTabSeletedRisksManagment(null);
            getMasterDataFields([constants.CERTIFICATION_STATUS, constants.LINKED_STATUS, constants.AEC_LEVEL]).then((data) => {
                const lists = _.groupBy(data.payload.data.messageBody.masterDataDetailEntries, 'field');
                const aecLevel = lists.aecLevel;
                aecLevel.push({
                    field: constants.AEC_LEVEL,
                    id: ID_OPTION_ALL_LEVEL_AEC,
                    key: "Todos",
                    parentId: null,
                    value: "Todos"
                });
                levelsAEC = _.remove(aecLevel, function (level) {
                    return level.key !== AEC_NO_APLICA;
                });
                if (_.get(data, 'payload.data.messageHeader.status') === SESSION_EXPIRED) {
                    redirectUrl("/login");
                }
            });
            consultList(constants.TEAM_FOR_EMPLOYEE);
            updateTitleNavBar("Mis clientes");
            clearInfoClient();
            clearContact();
            validatePermissionsByModule(MODULE_PROSPECT).then((data) => {
                if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                    redirectUrl("/login");
                }
            });
            validatePermissionsByModule(MODULE_CLIENTS).then((data) => {
                if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                    redirectUrl("/login");
                } else {
                    if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
                        redirectUrl("/dashboard");
                    }
                }
            });
            getRecentClients().then((data) => {
                changeStateSaveData(false, "");
                if (!validateResponse(data)) {
                    swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                }
            });
        }
    }

    _cleanSearch() {
        const { fields: { team }, clearClients, updateTabSeleted, updateTabSeletedRisksManagment,
            getRecentClients, changeStateSaveData } = this.props;
        this.props.resetForm();
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        clearClients();
        updateTabSeleted(null);
        updateTabSeletedRisksManagment(null);
        getRecentClients().then((data) => {
            changeStateSaveData(false, "");
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            }
        });
    }

    _onChangeTeam(val) {
        const { fields: { team } } = this.props;
        team.onChange(val);
        if (val) {
            this._handleClientsFind();
        }
    }

    _onChangeLinkedStatus(val) {
        const { fields: { linkedStatus } } = this.props;
        linkedStatus.onChange(val);
        if (val) {
            this._handleClientsFind();
        }
    }

    _onChangeCertificationStatus(val) {
        const { fields: { certificationStatus } } = this.props;
        certificationStatus.onChange(val);
        if (val) {
            this._handleClientsFind();
        }
    }

    _onChangeLevelAEC(val) {
        if (val !== '' && val !== undefined && val !== null) {
            const { updateTabSeleted, updateTabSeletedRisksManagment } = this.props;
            updateTabSeleted(TAB_RISKS_MANAGEMENT);
            updateTabSeletedRisksManagment(TAB_AEC);
        }
        const { fields: { levelAEC } } = this.props;
        levelAEC.onChange(val);
        if (val) {
            this._handleClientsFind();
        }
    }

    _handleClientsFind() {
        const { fields: { certificationStatus, team, linkedStatus, levelAEC }, changeStateSaveData,
            swtShowMessage, clientsFindServer, clientR, changePage } = this.props;
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        clientsFindServer(clientR.get('keyword'), 0, NUMBER_RECORDS, certificationStatus.value, team.value, linkedStatus.value, levelAEC.value).then((data) => {
            changeStateSaveData(false, "");
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            }
        });
        changePage(1);
    }

    _mapClientItems(item, idx) {
        return <ClientListItem
            key={idx}
            dataId={item.id}
            dataName={item.name}
            dataDocumentType={item.documentType}
            dataDocument={item.document}
            dataAccountManager={item.accountManager}
            dataEconomicGroup={item.economicGroup}
            dataIsProspect={item.prospect}
            dataIsAccess={item.access}
            dataDeleveryClient={item.deleveryClient}
        />
    }

    _clickButtonCreateProps() {
        redirectUrl("/dashboard/createPropspect");
    }

    _deleteAllRecentClientes() {
        const { deleteAllRecentClients, changeStateSaveData, swtShowMessage, getRecentClients } = this.props;
        this.setState({
            showConfirmDeleteRecentClientes: false
        });
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        deleteAllRecentClients().then((data) => {
            changeStateSaveData(false, "");
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            } else {
                getRecentClients((dataClients) => {
                    if (!validateResponse(dataClients)) {
                        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                    }
                });
            }
        });
    }

    render() {
        const { fields: { team, certificationStatus, linkedStatus, levelAEC }, handleSubmit, navBar, reducerGlobal } = this.props;
        const { clientR, selectsReducer } = this.props;
        var countClients = clientR.get('countClients');
        var status = clientR.get('status');
        var clientItems = clientR.get('responseClients');
        return (
            <div>
                <form>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xs={12} sm={12} md={6} lg={8} style={{ width: '100%' }}>
                            <SearchBarClient valueTeam={team.value} valueCertification={certificationStatus.value} linkingStatusus={linkedStatus.value} levelAEC={levelAEC.value} />
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} style={{ width: '100%' }}>
                            <Tooltip text="Limpiar búsqueda">
                                <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                    style={{ marginLeft: "17px" }}>
                                    <i className="erase icon"
                                        style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
                                </button>
                            </Tooltip>
                            {_.get(reducerGlobal.get('permissionsPropsect'), _.indexOf(reducerGlobal.get('permissionsPropsect'), VISUALIZAR), false) &&
                                <Tooltip text="Crear prospecto">
                                    <button className="btn btn-primary" onClick={this._clickButtonCreateProps} type="button"
                                        style={{ marginLeft: "17px" }}>
                                        <i className="add user icon"
                                            style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
                                    </button>
                                </Tooltip>
                            }
                        </Col>
                    </Row>
                    <Row style={{ borderBottom: "2px solid #D9DEDF", paddingBottom: "17px", paddingLeft: "17px", paddingRight: "17px" }}>
                        <Col xs={12} sm={12} md={3} lg={3} style={{ width: '100%' }}>
                            <ComboBox
                                name="celula"
                                labelInput="Célula"
                                {...team}
                                onChange={val => this._onChangeTeam(val)}
                                value={team.value}
                                onBlur={team.onBlur}
                                valueProp={'id'}
                                textProp={'description'}
                                searchClient={'client'}
                                data={selectsReducer.get('teamValueObjects')}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} style={{ width: '100%' }}>
                            <ComboBox
                                labelInput="Estado de la vinculación"
                                {...linkedStatus}
                                onChange={val => this._onChangeLinkedStatus(val)}
                                value={linkedStatus.value}
                                onBlur={linkedStatus.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={selectsReducer.get(constants.LINKED_STATUS) || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} style={{ width: '100%' }}>
                            <ComboBox
                                name="certificationStatus"
                                labelInput="Estado certificación"
                                {...certificationStatus}
                                onChange={val => this._onChangeCertificationStatus(val)}
                                value={certificationStatus.value}
                                onBlur={certificationStatus.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={selectsReducer.get(constants.CERTIFICATION_STATUS) || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} style={{ width: '100%' }}>
                            <ComboBox
                                name="levelAEC"
                                labelInput="Nivel AEC"
                                {...levelAEC}
                                onChange={val => this._onChangeLevelAEC(val)}
                                value={levelAEC.value}
                                onBlur={levelAEC.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={levelsAEC || []}
                            />
                        </Col>
                    </Row>
                </form>
                <Row style={{ marginLeft: "3px", marginRigth: "10px" }}>
                    <Col xs={10} md={10} lg={10}>
                        {clientR.get('showingRecentClients') &&
                            <div style={{ marginTop: "15px" }}>
                                <h5 className="form-item" style={{ fontSize: "16px", marginLeft: "3px" }}>
                                    Clientes recientes
                                        </h5>
                            </div>
                        }
                    </Col>
                    <Col xs={2} md={2} lg={2}>
                        {clientR.get('showingRecentClients') &&
                            <div style={{ marginTop: "15px" }}>
                                <Tooltip text="Quitar todos los clientes de recientes">
                                    <h5 className="form-item" style={{ fontSize: "16px", marginRight: "20px", float: "right" }}>
                                        <a href="#" onClick={() => this.setState({ showConfirmDeleteRecentClientes: true })}>Quitar todos</a >
                                    </h5>
                                </Tooltip>
                            </div>
                        }
                    </Col>
                </Row>
                <Row style={{ paddingLeft: "10px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div className="news-page content">
                            <div className="team-modal">
                                {countClients === 0 && status === 'processed' ?
                                    <div style={{ textAlign: "center", marginTop: "15px" }}><h4 className="form-item">
                                        Señor usuario, no se encontraron clientes que cumplan el criterio de
                                        búsqueda.</h4></div> :
                                    clientItems.map(this._mapClientItems)}
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={12} lg={12}>
                        <Pagination valueTeam={team.value} valueCertification={certificationStatus.value} />
                    </Col>
                </Row>
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmDeleteRecentClientes}
                    title="Clientes recientes"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    text="Señor usuario, ¿esta seguro de quitar todos los clientes recientes?"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmDeleteRecentClientes: false })}
                    onConfirm={() => this._deleteAllRecentClientes()} />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clientsFindServer,
        clearClients,
        getMasterDataFields,
        changePage,
        changeKeyword,
        consultList,
        updateTitleNavBar,
        clearContact,
        clearInfoClient,
        validatePermissionsByModule,
        updateTabSeleted,
        updateTabSeletedRisksManagment,
        getRecentClients,
        swtShowMessage,
        changeStateSaveData,
        deleteAllRecentClients,
        getRecentClients
    }, dispatch);
}

function mapStateToProps({ clientR, selectsReducer, navBar, contactsByClient, clientInformacion, reducerGlobal }, { fields }) {
    return {
        clientR,
        selectsReducer,
        navBar,
        contactsByClient,
        clientInformacion,
        reducerGlobal
    };
}

export default reduxForm({ form: 'simple', fields }, mapStateToProps, mapDispatchToProps)(ClientsFind);
