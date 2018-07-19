import React, { Component } from "react";
import { Col, Row } from "react-flexbox-grid";
import { bindActionCreators } from "redux";
import {
    changeKeyword,
    changePage,
    clearClients,
    clientsFindServer,
    deleteAllRecentClients,
    getRecentClients,
    saveSelectValue,
    backButtonFilter
} from "./actions";
import ClientListItem from "./clientListItem";
import SearchBarClient from "./searchBarClient";
import { AEC_NO_APLICA, ID_OPTION_ALL_LEVEL_AEC, NUMBER_RECORDS } from "./constants";
import Pagination from "./pagination";
import { redirectUrl } from "../globalComponents/actions";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import { consultList, getMasterDataFields } from "../selectsComponent/actions";
import * as constants from "../selectsComponent/constants";
import { reduxForm } from "redux-form";
import { updateTitleNavBar } from "../navBar/actions";
import { clearContact } from "../contact/actions";
import { clearInfoClient } from "../clientInformation/actions";
import {
    MESSAGE_ERROR_SWEET_ALERT,
    MESSAGE_LOAD_DATA,
    MODULE_CLIENTS,
    MODULE_PROSPECT,
    SESSION_EXPIRED,
    TAB_RISKS_MANAGEMENT,
    TITLE_ERROR_SWEET_ALERT,
    VISUALIZAR,
    valuesYesNo
} from "../../constantsGlobal";
import { validatePermissionsByModule, validateResponse, onSessionExpire } from "../../actionsGlobal";
import { updateTabSeleted } from "../clientDetailsInfo/actions";
import { updateTabSeletedRisksManagment } from "../risksManagement/actions";
import { TAB_AEC } from "../risksManagement/constants";
import { swtShowMessage } from "../sweetAlertMessages/actions";
import Tooltip from "../toolTip/toolTipComponent";
import SweetAlert from "../sweetalertFocus";
import { showLoading } from '../loading/actions';
import { isNil } from 'lodash';

const fields = ["team", "certificationStatus", "bussinesRol", "management", "decisionCenter", "levelAEC"];
var levelsAEC;
let varBackButtonFilter = false;

class ClientsFind extends Component {
    constructor(props) {
        super(props);
        this._onChangeTeam = this._onChangeTeam.bind(this);
        this._onChangeBussinesRol = this._onChangeBussinesRol.bind(this);
        this._onChangeManagement = this._onChangeManagement.bind(this);
        this._onChangeDecisionCenter = this._onChangeDecisionCenter.bind(this);
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
        if (window.localStorage.getItem('sessionTokenFront') === "" || window.localStorage.getItem('sessionTokenFront') === undefined) {
            redirectUrl("/login");
        } else {
            const { fields: { team, bussinesRol, management, decisionCenter, certificationStatus, levelAEC }, clearClients, consultList, getMasterDataFields, clearContact, clearInfoClient,
                updateTitleNavBar, validatePermissionsByModule, selectsReducer, updateTabSeleted,
                updateTabSeletedRisksManagment, getRecentClients, swtShowMessage, showLoading, clientR, backButtonFilter } = this.props;

            const backButtonVariable = clientR.get('backStateFilters');
            if (backButtonVariable) {
                const filters = clientR.get('filterValues');
                _.forEach(filters, function (value, key) {
                    switch (value.name) {
                        case "celula":
                            team.onChange(value.value);
                            break;
                        case "bussinesRol":
                            bussinesRol.onChange(value.value);
                            break;
                        case "management":
                            management.onChange(value.value);
                            break;
                        case "decisionCenter":
                            decisionCenter.onChange(value.value);
                            break;
                        case "certificationStatus":
                            certificationStatus.onChange(value.value);
                            break;
                        case "levelAEC":
                            levelAEC.onChange(value.value);
                            break;
                    }
                });
                
            } else {
                backButtonFilter(varBackButtonFilter);
            }


            showLoading(true, MESSAGE_LOAD_DATA);
            clearClients();
            updateTabSeleted(null);
            updateTabSeletedRisksManagment(null);
            getMasterDataFields([constants.CERTIFICATION_STATUS, constants.BUSINESS_ROL, constants.AEC_LEVEL, constants.MANAGEMENT_BRAND]).then((data) => {
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
                    onSessionExpire();
                }
            });
            consultList(constants.TEAM_FOR_EMPLOYEE);
            updateTitleNavBar("Mis clientes");
            clearInfoClient();
            clearContact();
            validatePermissionsByModule(MODULE_PROSPECT).then((data) => {
                if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                    onSessionExpire();
                }
            });
            validatePermissionsByModule(MODULE_CLIENTS).then((data) => {
                if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                    onSessionExpire();
                } else {
                    if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
                        redirectUrl("/dashboard");
                    }
                }
            });
            getRecentClients().then((data) => {
                showLoading(false, "");
                if (!validateResponse(data)) {
                    swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                }
            });
        }
    }

    _cleanSearch() {
        const { fields: { team }, clearClients, updateTabSeleted, updateTabSeletedRisksManagment,
            getRecentClients, showLoading } = this.props;
        this.props.resetForm();
        showLoading(true, MESSAGE_LOAD_DATA);
        clearClients();
        updateTabSeleted(null);
        updateTabSeletedRisksManagment(null);
        getRecentClients().then((data) => {
            showLoading(false, "");
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            }
        });
    }

    _onChangeTeam(val) {
        const { fields: { team }, saveSelectValue } = this.props;
        const jsonFilter = {
            name: "celula",
            value: val
        };
        team.onChange(val);
        if (val) {
            this._handleClientsFind();
        }
        saveSelectValue(jsonFilter);
    }

    _onChangeBussinesRol(val) {
        const { fields: { bussinesRol }, saveSelectValue } = this.props;
        const jsonFilter = {
            name: "bussinesRol",
            value: val
        };
        bussinesRol.onChange(val);
        if (val) {
            this._handleClientsFind();
        }
        saveSelectValue(jsonFilter);
    }

    _onChangeManagement(val) {
        const { fields: { management }, saveSelectValue } = this.props;
        const jsonFilter = {
            name: "management",
            value: val
        };
        management.onChange(val);
        if (val) {
            this._handleClientsFind();
        }
        saveSelectValue(jsonFilter);

    }

    _onChangeDecisionCenter(val) {
        const { fields: { decisionCenter }, saveSelectValue } = this.props;
        const jsonFilter = {
            name: "decisionCenter",
            value: val
        };
        decisionCenter.onChange(val);
        if (val) {
            this._handleClientsFind();
        }
        saveSelectValue(jsonFilter);
    }

    _onChangeCertificationStatus(val) {
        const { fields: { certificationStatus }, saveSelectValue } = this.props;
        const jsonFilter = {
            name: "certificationStatus",
            value: val
        };
        certificationStatus.onChange(val);
        if (val) {
            this._handleClientsFind();
        }
        saveSelectValue(jsonFilter);
    }

    _onChangeLevelAEC(val) {
        if (val !== '' && val !== undefined && val !== null) {
            const { updateTabSeleted, updateTabSeletedRisksManagment } = this.props;
            updateTabSeleted(TAB_RISKS_MANAGEMENT);
            updateTabSeletedRisksManagment(TAB_AEC);
        }
        const { fields: { levelAEC }, saveSelectValue } = this.props;
        const jsonFilter = {
            name: "levelAEC",
            value: val
        };
        levelAEC.onChange(val);
        if (val) {
            this._handleClientsFind();
        }
        saveSelectValue(jsonFilter);

    }

    _handleClientsFind() {
        const { fields: { certificationStatus, team, bussinesRol, management, decisionCenter, levelAEC }, showLoading,
            swtShowMessage, clientsFindServer, clientR, changePage } = this.props;
        showLoading(true, MESSAGE_LOAD_DATA);

        clientsFindServer(clientR.get('keyword'), 0, NUMBER_RECORDS, certificationStatus.value, team.value, bussinesRol.value, management.value,
            decisionCenter.value, levelAEC.value).then((data) => {
                showLoading(false, "");
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
        const { deleteAllRecentClients, showLoading, swtShowMessage, getRecentClients } = this.props;
        this.setState({
            showConfirmDeleteRecentClientes: false
        });
        showLoading(true, MESSAGE_LOAD_DATA);
        deleteAllRecentClients().then((data) => {
            showLoading(false, "");
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
        const { fields: { team, certificationStatus, bussinesRol, management, decisionCenter, levelAEC }, handleSubmit, navBar, reducerGlobal } = this.props;
        const { clientR, selectsReducer } = this.props;
        const countClients = isNil(clientR.get('countClients')) ? 0 : clientR.get('countClients');
        const status = clientR.get('status');
        const clientItems = isNil(clientR.get('responseClients')) ? [] : clientR.get('responseClients');

        return (
            <div>
                <form>
                    <Row style={{ marginTop: "15px", marginLeft: '10px' }}>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <SearchBarClient valueTeam={team.value} valueCertification={certificationStatus.value} bussinesRol={bussinesRol.value}
                                management={management.value} decisionCenter={decisionCenter.value} levelAEC={levelAEC.value} />
                        </Col>
                        <Col xs={7} sm={7} md={4} lg={4}>
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
                        <Col xs={4} sm={12} md={2} lg={2}>
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
                    <Row style={{ borderBottom: "2px solid #D9DEDF", paddingBottom: "20px", marginLeft: '10px' }}>
                        <Col xs={4} sm={4} md={2} lg={2}>
                            <ComboBox
                                labelInput="Rol de negocio"
                                {...bussinesRol}
                                onChange={val => this._onChangeBussinesRol(val)}
                                value={bussinesRol.value}
                                onBlur={bussinesRol.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={selectsReducer.get(constants.BUSINESS_ROL) || []}
                            />
                        </Col>
                        <Col xs={4} sm={4} md={2} lg={2}>
                            <ComboBox
                                labelInput="Gerenciamiento"
                                {...management}
                                onChange={val => this._onChangeManagement(val)}
                                value={management.value}
                                onBlur={management.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={selectsReducer.get(constants.MANAGEMENT_BRAND) || []}
                            />
                        </Col>
                        <Col xs={4} sm={4} md={2} lg={2}>
                            <ComboBox
                                labelInput="Centro de decisión"
                                {...decisionCenter}
                                onChange={val => this._onChangeDecisionCenter(val)}
                                value={decisionCenter.value}
                                onBlur={decisionCenter.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient={'client'}
                                data={valuesYesNo}
                            />
                        </Col>
                        <Col xs={4} sm={4} md={2} lg={2}>
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
                        <Col xs={4} sm={4} md={2} lg={2}>
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
                        <Pagination valueTeam={team.value} valueCertification={certificationStatus.value} bussinesRolValue={bussinesRol.value}
                            managementValue={management.value} decisionCenterValue={decisionCenter.value} levelAECValue={levelAEC.value} />
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
        showLoading,
        deleteAllRecentClients,
        saveSelectValue,
        backButtonFilter
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
