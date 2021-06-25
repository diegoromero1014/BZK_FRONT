import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';
import RaitingInternal from './ratingInternal';
import TabClientInfo from './tabClientInfo';
import ButtonTeamComponent from '../clientTeam/buttonTeamComponent';
import ButtonRiskGroup from '../clientRiskGroup/buttonClientRiskGroup';
import ButtonEconomicgroup from '../clientEconomicGroup/buttonClientEconomicGroup';
import NotificationComponent from '../notification/notificationComponent';
import NotificationExpiredPortfolio from '../alertPortfolioExpirtation/notificationExpiredPortfolio';
import { consultInfoClient } from './actions';
import { validateExpiredPortfolio } from './actions';
import { updateTitleNavBar, viewAlertClient } from '../navBar/actions';
import { redirectUrl } from '../globalComponents/actions';
import { clearEntities } from '../clientDetailsInfo/linkingClient/LinkEntitiesComponent/actions';
import { showLoading } from '../loading/actions';
import { resetAccordion } from '../clientDetailsInfo/actions';
import { updateTabSeletedCS } from '../customerStory/actions';
import { ORANGE_COLOR, BLUE_COLOR, AEC_NO_APLIED, GRAY_COLOR, MODULE_CLIENTS, MODULE_STUDY_CREDIT, VISOR_CLIENTE, GRUPO_RIESGO } from '../../constantsGlobal';
import { validatePermissionsByModule, onSessionExpire } from '../../actionsGlobal';
import { TAB_STORY } from '../customerStory/constants';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';

export class ComponentClientInformation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allow_visor_cliente: false,
            notification: {
                open: false,
                data: null
            },
            hide_information: false
        };

        this.closeNotification = this.closeNotification.bind(this);
    }

    componentWillMount() {
        if (!_.isNull(window.sessionStorage.getItem('idClientSelected')) && !_.isUndefined(window.sessionStorage.getItem('idClientSelected'))) {
            const { resetAccordion, tabReducer, validatePermissionsByModule } = this.props;
            var tabActive = tabReducer.get('tabSelected');
            if (tabActive === null) {
                resetAccordion();
            }
            
            const { updateTitleNavBar, viewAlertClient, consultInfoClient, showLoading, updateTabSeletedCS } = this.props;
            updateTitleNavBar("Mis clientes");
            showLoading(true, 'Cargando...');

            validatePermissionsByModule(MODULE_CLIENTS).then((data) => {
                let permissions = _.get(data, 'payload.data.data.permissions')
                let allow_visor_cliente = (permissions.indexOf(VISOR_CLIENTE) >= 0)
                this.setState({
                    allow_visor_cliente: allow_visor_cliente
                })

            });
            validatePermissionsByModule(MODULE_STUDY_CREDIT);

            consultInfoClient().then((data) => {
                if (!_.get(data, 'payload.data.validateLogin')) {
                    onSessionExpire();
                }
                showLoading(false, '');
            });

            viewAlertClient(true);
            updateTabSeletedCS(TAB_STORY);

        } else {
            redirectUrl("/dashboard/clients");
        }
    }

    componentDidMount() {
        document.getElementById('dashboardComponentScroll').scrollTop = 0;
        
        const { validateExpiredPortfolio } = this.props;
        validateExpiredPortfolio().then((response) => {
            const { data } = response.payload.data;
            if (data.length > 0) {
                this.setState({
                    notification: {
                        open: true,
                        data: data 
                    }
                });
            }
        })
    }

    componentWillUnmount() {
        this.props.viewAlertClient(false);
        this.props.clearEntities();
    }

    closeNotification() {
        this.setState({
            notification: {
                open: false,
                data: null
            }
        })
    }
    hideComponents = () => {
        this.setState({
            hide_information: !this.state.hide_information
        })
    }
    hideComponentsVisor = () => {
        this.setState({
            hide_information: true
        });
    }
    showComponentsVisor = () => {
        this.setState({
            hide_information: false
        });
    }
    render() {
        const { clientInformacion, reducerGlobal } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        var showAECNoAplica = false;
        var showAECNivel = true;
        var aecStatus = "";
        
        const allowAccessRiskGroup = _.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), GRUPO_RIESGO), false);
        const hideInformation = this.state.hide_information;
        const statusInformationStyle = hideInformation===true?"hidden-info standard-div":"showen-indo standard-div"
        const iconStyleInfo = hideInformation===true?"hidden-icon icon-normal":"showen-icon icon-normal";
        if (infoClient !== null && infoClient !== undefined) {
            aecStatus = infoClient.aecStatus;
            if (aecStatus === undefined || aecStatus === null || aecStatus === AEC_NO_APLIED) {
                showAECNoAplica = true;
                showAECNivel = false;
            }
        }

        return (
            <div>
                { this.state.notification.open && 
                    <NotificationComponent
                        type="error" 
                        title="Carteras vencidas o próximas a vencer." 
                        component={<NotificationExpiredPortfolio data={this.state.notification.data} />}
                        close={this.closeNotification}
                    />
                }
                <header className="header-client-detail" style={{ boxShadow: "-3px 2px 5px 0 rgba(0, 0, 0, 0.2)" }}>
                    <Row>
                        <Col xs={11} sm={11} md={11} lg={11}>
                            <div className="company-detail" style={{ marginLeft: "20px", marginRight: "20px", marginTop: "3px" }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <h3 style={{ wordBreak: 'keep-all', marginRight: "10px" }} className="inline title-head">
                                        {infoClient.clientName}
                                    </h3>
                                    {infoClient.isProspect &&
                                        <span style={{
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            height: "30px",
                                            display: "inline !important",
                                            textTransform: "none !important",
                                        }}
                                            className="label label-important bounceIn animated prospect">Prospecto</span>
                                    }
                                    {showAECNivel &&
                                        <span style={{
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            height: "30px",
                                            display: "inline !important",
                                            textTransform: "none !important",
                                            marginLeft: "10px",
                                            backgroundColor: "#ec5f48"
                                        }}
                                            className="label label-important bounceIn animated aec-status">{aecStatus}</span>
                                    }
                                    {showAECNoAplica &&
                                        <span style={{
                                            borderRadius: "2px",
                                            fontSize: "15px",
                                            height: "30px",
                                            display: "inline !important",
                                            textTransform: "none !important",
                                            marginLeft: "10px",
                                            backgroundColor: "#3498db"
                                        }}
                                            className="label label-important bounceIn animated aec-normal">AEC: No aplica</span>
                                    }
                                </div>
                                <div id="divInformation" className={`${statusInformationStyle}`} style={{ width: "100%" }}>
                                    <table id="tblInformation" style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th style={{ fontWeight: "bold", color: "#4C5360" }}>Tipo de documento</th>
                                                <th style={{ fontWeight: "bold", color: "#4C5360" }}>Número de documento</th>
                                                <th style={{ fontWeight: "bold", color: "#4C5360" }}>Rol de negocio
                                                consolidado
                                            </th>
                                                <th style={{ fontWeight: "bold", color: "#4C5360" }}>Calificación interna</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                                    <span style={{ marginLeft: "0px" }}>{infoClient.clientNameType}</span>
                                                </td>
                                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                                    <span style={{ marginLeft: "0px" }}>{infoClient.clientIdNumber}</span>
                                                </td>
                                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                                    <span
                                                        style={{ marginLeft: "0px" }}>{infoClient.relationshipStatusName}</span>
                                                </td>
                                                <td style={{ width: "25%", verticalAlign: "initial" }}>
                                                    <span style={{ marginLeft: "0px" }}><RaitingInternal
                                                        valueRaiting={infoClient.internalRatingKey} /></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="4">
                                                    <dl className="company-detail" style={{ paddingTop: "15px" }}>
                                                        <dt><span style={{
                                                            fontWeight: "bold",
                                                            color: "#4C5360",
                                                            marginLeft: "0px"
                                                        }}>Breve descripción de la empresa</span></dt>
                                                        <dd style={{ marginLeft: "0px" }}><p style={{
                                                            wordBreak: 'keep-all',
                                                            textAlign: 'justify'
                                                        }}>{infoClient.description}</p></dd>
                                                    </dl>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Col>
                        <Col xs={1} md={1} lg={1}>
                            <table style={{ height: '100%', width: '50%', float: 'right' }}>
                                <tbody>
                                    <tr style={{height:'15px'}}>
                                        <td className={`${iconStyleInfo}`} style={{display:'flex', justifyContent:'center',height:'15px', marginTop: "10px",  borderRadius: "0px" }}>
                                            <Icon id="btnHideInfoClient" name="chevron circle down" onClick={this.hideComponents} style={{color:"#2671d7",cursor:'pointer', fontSize:'25px'}} ></Icon>
                                        </td>
                                    </tr>
                                    <tr >
                                        <td className={`${statusInformationStyle}`} style={{ marginTop: "0px", backgroundColor: ORANGE_COLOR, borderRadius: "0px" }}>
                                            <ButtonTeamComponent />
                                        </td>
                                    </tr >
                                    {
                                        allowAccessRiskGroup && infoClient.hasRiskGroup &&
                                        <tr >
                                            <td className={`${statusInformationStyle}`} style={{ marginTop: "0px", backgroundColor: GRAY_COLOR, borderRadius: "0px" }}>
                                                <ButtonRiskGroup />
                                            </td>
                                        </tr>
                                    }

                                    {infoClient.economicGroup &&
                                        <tr >
                                            <td className={`${statusInformationStyle}`} style={{ marginTop: "0px", backgroundColor: BLUE_COLOR, borderRadius: "0px" }}>
                                                <ButtonEconomicgroup />
                                            </td>
                                        </tr>
                                    }
                                    
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </header>
                <TabClientInfo infoClient={infoClient} allow_visor={this.state.allow_visor_cliente} activeHideInfo={this.hideComponentsVisor} activeShowIndo={this.showComponentsVisor} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultInfoClient,
        updateTitleNavBar,
        viewAlertClient,
        redirectUrl,
        clearEntities,
        showLoading,
        resetAccordion,
        updateTabSeletedCS,
        validatePermissionsByModule,
        validateExpiredPortfolio
    }, dispatch);
}

function mapStateToProps({ clientInformacion, navBar, tabReducer, reducerGlobal }, ownerProps) {
    return {
        clientInformacion,
        tabReducer,
        navBar,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentClientInformation);