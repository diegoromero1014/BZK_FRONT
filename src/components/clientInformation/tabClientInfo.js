import React, { Component } from 'react';
import { redirectUrl } from '../globalComponents/actions';
import DetailsInfoClient from '../clientDetailsInfo/detailsInfoClient';
import ContactInfo from '../contact/component';
import Partners from '../clients/partners/tabComponent';
import PrevisitaInfo from '../previsita/component';
import VisitaInfo from '../visit/component';
import PipelineInfo from '../pipeline/component';
import BusinessPlanInfo from '../businessPlan/component';
import PendingInfo from '../pendingTask/component';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateTabSeleted } from '../clientDetailsInfo/actions';
import { consultModulesAccess } from '../navBar/actions';
import {
    MODULE_CONTACTS, MODULE_SHAREHOLDERS, MODULE_PREVISITS, MODULE_VISITS, MODULE_TASKS,
    MODULE_PIPELINE, MODULE_BUSSINESS_PLAN, MODULE_RISKS_MANAGEMENT, MODULE_CUSTOMER_STORY,
    MODULE_BOARD_MEMBERS, MODULE_PARTNERS
} from '../../constantsGlobal';
import {
    TAB_INFO, TAB_CONTACTS, TAB_SHAREHOLDER, TAB_PREVISITS, TAB_VISITS,
    TAB_PENDING_TASK, TAB_PIPELINE, TAB_BUSINESS_PLAN, TAB_RISKS_MANAGEMENT,
    TAB_CUSTOMER_STORY
} from '../../constantsGlobal';

import RisksManagements from '../risksManagement/componentRisksManagement';
import ComponentCustomerStory from '../customerStory/componentCustomerStory';

class TabClientInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabActive: 1
        };
    }

    _handleClickTabItem(tabSelect, e) {
        const { updateTabSeleted } = this.props;
        updateTabSeleted(tabSelect);
        this.setState({
            tabActive: tabSelect
        });
    }

    render() {
        const { infoClient, tabReducer, navBar } = this.props;
        var styleInfo = true;
        var styleContacts = false;
        var styleShareholders = false;
        var stylePrevisitas = false;
        var styleVisits = false;
        var stylePipeline = false;
        let stylePendings = false;
        let styleBusinessPlan = false;
        let styleRisksManagement = false;
        let styleCustomerStory = false;

        var backgroundInfo = { height: "60px", borderBottomStyle: "solid", borderBottomColor: "#3498db", width: "70px" };
        var backgroundContacts = { height: "60px", borderBottomStyle: "none", width: "70px" };
        var backgroundShareholders = { height: "60px", borderBottomStyle: "none", width: "70px" };
        var backgroundPrevisitas = { height: "60px", borderBottomStyle: "none", width: "70px" };
        var backgroundVisits = { height: "60px", borderBottomStyle: "none", width: "70px" };
        let backgroundPending = { height: "60px", borderBottomStyle: "none", width: "70px" };
        let backgroundPipeline = { height: "60px", borderBottomStyle: "none", width: "70px" };
        let backgroundBusinessPlan = { height: "60px", borderBottomStyle: "none", width: "140px" }
        let backgroundRisksManagement = { height: "60px", borderBottomStyle: "none", width: "140px" };
        let backgroundCustomerStory = { height: "60px", borderBottomStyle: "none", width: "150px" };

        var tabActive = tabReducer.get('tabSelected');
        if (tabActive === null || tabActive === undefined || tabActive === "") {
            tabActive = TAB_INFO;
        }
        if (tabActive === TAB_INFO) {
            //la configuración ya se hizo arriba
        } else if (tabActive === TAB_CONTACTS) {
            styleInfo = false;
            styleContacts = true;
            styleShareholders = false;
            stylePrevisitas = false;
            styleVisits = false;
            stylePendings = false;
            stylePipeline = false;
            styleBusinessPlan = false;
            styleRisksManagement = false;
            styleCustomerStory = false;

            backgroundInfo = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundContacts = {
                height: "60px",
                borderBottomStyle: "solid",
                borderBottomColor: "#3498db",
                width: "70px"
            };
            backgroundShareholders = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPrevisitas = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundVisits = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPending = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPipeline = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundBusinessPlan = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundRisksManagement = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundCustomerStory = { height: "60px", borderBottomStyle: "none", width: "150px" };
        } else if (tabActive === TAB_SHAREHOLDER) {
            styleInfo = false;
            styleContacts = false;
            styleShareholders = true;
            stylePrevisitas = false;
            styleVisits = false;
            stylePendings = false;
            stylePipeline = false;
            styleBusinessPlan = false;
            styleRisksManagement = false;
            styleCustomerStory = false;

            backgroundInfo = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundContacts = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundShareholders = {
                height: "60px",
                borderBottomStyle: "solid",
                borderBottomColor: "#3498db",
                width: "70px"
            };
            backgroundPrevisitas = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundVisits = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPending = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPipeline = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundBusinessPlan = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundRisksManagement = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundCustomerStory = { height: "60px", borderBottomStyle: "none", width: "150px" };
        } else if (tabActive === TAB_VISITS) {
            styleInfo = false;
            styleContacts = false;
            styleShareholders = false;
            stylePrevisitas = false;
            styleVisits = true;
            stylePendings = false;
            stylePipeline = false;
            styleBusinessPlan = false;
            styleRisksManagement = false;
            styleCustomerStory = false;

            backgroundInfo = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundContacts = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundShareholders = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPrevisitas = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundVisits = {
                height: "60px",
                borderBottomStyle: "solid",
                borderBottomColor: "#3498db",
                width: "70px"
            };
            backgroundPending = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPipeline = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundBusinessPlan = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundRisksManagement = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundCustomerStory = { height: "60px", borderBottomStyle: "none", width: "150px" };
        } else if (tabActive === TAB_PREVISITS) {
            styleInfo = false;
            styleContacts = false;
            styleShareholders = false;
            stylePrevisitas = true;
            styleVisits = false;
            stylePendings = false;
            stylePipeline = false;
            styleBusinessPlan = false;
            styleRisksManagement = false;
            styleCustomerStory = false;

            backgroundInfo = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundContacts = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundShareholders = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundVisits = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPrevisitas = {
                height: "60px",
                borderBottomStyle: "solid",
                borderBottomColor: "#3498db",
                width: "70px"
            };
            backgroundPending = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPipeline = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundBusinessPlan = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundRisksManagement = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundCustomerStory = { height: "60px", borderBottomStyle: "none", width: "150px" };

        } else if (tabActive === TAB_PENDING_TASK) {
            styleInfo = false;
            styleContacts = false;
            styleShareholders = false;
            stylePrevisitas = false;
            styleVisits = false;
            stylePendings = true;
            stylePipeline = false;
            styleBusinessPlan = false;
            styleRisksManagement = false;
            styleCustomerStory = false;

            backgroundInfo = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundContacts = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundShareholders = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundVisits = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPrevisitas = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPending = {
                height: "60px",
                borderBottomStyle: "solid",
                borderBottomColor: "#3498db",
                width: "70px"
            };
            backgroundPipeline = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundBusinessPlan = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundRisksManagement = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundCustomerStory = { height: "60px", borderBottomStyle: "none", width: "150px" };
        }
        else if (tabActive === TAB_PIPELINE) {
            styleInfo = false;
            styleContacts = false;
            styleShareholders = false;
            stylePrevisitas = false;
            styleVisits = false;
            stylePendings = false;
            stylePipeline = true;
            styleBusinessPlan = false;
            styleRisksManagement = false;
            styleCustomerStory = false;

            backgroundInfo = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundContacts = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundShareholders = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundVisits = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPrevisitas = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPending = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPipeline = {
                height: "60px",
                borderBottomStyle: "solid",
                borderBottomColor: "#3498db",
                width: "70px"
            };
            backgroundBusinessPlan = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundRisksManagement = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundCustomerStory = { height: "60px", borderBottomStyle: "none", width: "150px" };
        }
        else if (tabActive === TAB_BUSINESS_PLAN) {
            styleInfo = false;
            styleContacts = false;
            styleShareholders = false;
            stylePrevisitas = false;
            styleVisits = false;
            stylePendings = false;
            stylePipeline = false;
            styleBusinessPlan = true;
            styleRisksManagement = false;
            styleCustomerStory = false;

            backgroundInfo = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundContacts = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundShareholders = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundVisits = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPrevisitas = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPending = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPipeline = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundBusinessPlan = {
                height: "60px",
                borderBottomStyle: "solid",
                borderBottomColor: "#3498db",
                width: "140px"
            };
            backgroundRisksManagement = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundCustomerStory = { height: "60px", borderBottomStyle: "none", width: "150px" };
        } else if (tabActive === TAB_RISKS_MANAGEMENT) {
            styleInfo = false;
            styleContacts = false;
            styleShareholders = false;
            stylePrevisitas = false;
            styleVisits = false;
            stylePendings = false;
            stylePipeline = false;
            styleBusinessPlan = false;
            styleRisksManagement = true;
            styleCustomerStory = false;

            backgroundInfo = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundContacts = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundShareholders = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundVisits = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPrevisitas = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPending = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPipeline = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundBusinessPlan = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundRisksManagement = {
                height: "60px",
                borderBottomStyle: "solid",
                borderBottomColor: "#3498db",
                width: "140px"
            };
            backgroundCustomerStory = { height: "60px", borderBottomStyle: "none", width: "150px" };
        } else if (tabActive === TAB_CUSTOMER_STORY) {
            styleInfo = false;
            styleContacts = false;
            styleShareholders = false;
            stylePrevisitas = false;
            styleVisits = false;
            stylePendings = false;
            stylePipeline = false;
            styleBusinessPlan = false;
            styleRisksManagement = false;
            styleCustomerStory = true;

            backgroundInfo = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundContacts = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundShareholders = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundVisits = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPrevisitas = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPending = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundPipeline = { height: "60px", borderBottomStyle: "none", width: "70px" };
            backgroundBusinessPlan = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundRisksManagement = { height: "60px", borderBottomStyle: "none", width: "140px" };
            backgroundCustomerStory = {
                height: "60px",
                borderBottomStyle: "solid",
                borderBottomColor: "#3498db",
                width: "150px"
            };
        }
        return (
            <div>
                <div className="my-custom-tab" style={{ marginTop: "2px" }}>
                    <ul className="nav nav-tabs custom-tab" style={{
                        backgroundColor: "white", height: "60px",
                        boxShadow: "0px 1px 0px 0 rgba(0, 0, 0, 0.2)", marginTop: "0px"
                    }}>
                        <li style={backgroundInfo} onClick={this._handleClickTabItem.bind(this, TAB_INFO)}>
                            <a className="button-link-url" style={{ marginRight: "15px" }}>Info</a>
                        </li>
                        {_.get(navBar.get('mapModulesAccess'), MODULE_CONTACTS) &&
                            <li style={backgroundContacts} onClick={this._handleClickTabItem.bind(this, TAB_CONTACTS)}>
                                <a className="button-link-url" style={{ marginRight: "15px" }}>Contactos</a>
                            </li>
                        }
                        {_.get(navBar.get('mapModulesAccess'), MODULE_PARTNERS) &&
                            <li style={backgroundShareholders} onClick={this._handleClickTabItem.bind(this, TAB_SHAREHOLDER)}>
                                <a className="button-link-url" style={{ marginRight: "15px" }}>Accionistas/Junta</a>
                            </li>
                        }
                        {_.get(navBar.get('mapModulesAccess'), MODULE_CUSTOMER_STORY) &&
                            <li style={backgroundCustomerStory}
                                onClick={this._handleClickTabItem.bind(this, TAB_CUSTOMER_STORY)}>
                                <a className="button-link-url" style={{ marginRight: "15px" }}>Historial del cliente</a>
                            </li>
                        }
                        {_.get(navBar.get('mapModulesAccess'), MODULE_PREVISITS) &&
                            <li style={backgroundPrevisitas} onClick={this._handleClickTabItem.bind(this, TAB_PREVISITS)}>
                                <a className="button-link-url" style={{ marginRight: "15px" }}>Previsitas</a>
                            </li>
                        }
                        {_.get(navBar.get('mapModulesAccess'), MODULE_VISITS) &&
                            <li style={backgroundVisits} onClick={this._handleClickTabItem.bind(this, TAB_VISITS)}>
                                <a className="button-link-url" style={{ marginRight: "15px" }}>Visitas/Reunión</a>
                            </li>
                        }
                        {_.get(navBar.get('mapModulesAccess'), MODULE_TASKS) &&
                            <li style={backgroundPending} onClick={this._handleClickTabItem.bind(this, TAB_PENDING_TASK)}>
                                <a className="button-link-url" style={{ marginRight: "15px" }}>Tareas</a>
                            </li>
                        }
                        {_.get(navBar.get('mapModulesAccess'), MODULE_PIPELINE) &&
                            <li style={backgroundPipeline} onClick={this._handleClickTabItem.bind(this, TAB_PIPELINE)}>
                                <a className="button-link-url" style={{ marginRight: "15px" }}>Pipeline</a>
                            </li>
                        }
                        {_.get(navBar.get('mapModulesAccess'), MODULE_BUSSINESS_PLAN) &&
                            <li style={backgroundBusinessPlan} onClick={this._handleClickTabItem.bind(this, TAB_BUSINESS_PLAN)}>
                                <a className="button-link-url" style={{ marginRight: "15px" }}>Planes de negocios</a>
                            </li>
                        }
                        {_.get(navBar.get('mapModulesAccess'), MODULE_RISKS_MANAGEMENT) &&
                            <li style={backgroundRisksManagement}
                                onClick={this._handleClickTabItem.bind(this, TAB_RISKS_MANAGEMENT)}>
                                <a className="button-link-url" style={{ marginRight: "15px" }}>Gestión de riesgos</a>
                            </li>
                        }
                    </ul>
                    <div className="header-client-detail" style={{
                        paddingLeft: "20px",
                        height: "84%",
                        paddingRight: "20px",
                        backgroundColor: "white",
                        marginTop: "-8px"
                    }}>
                        {styleInfo && <DetailsInfoClient infoClient={infoClient} />}
                        {styleContacts && <ContactInfo infoClient={infoClient} />}
                        {styleShareholders && <Partners infoClient={infoClient} />}
                        {stylePrevisitas && <PrevisitaInfo infoClient={infoClient} />}
                        {styleVisits && <VisitaInfo infoClient={infoClient} />}
                        {stylePendings && <PendingInfo infoClient={infoClient} />}
                        {stylePipeline && <PipelineInfo infoClient={infoClient} />}
                        {styleBusinessPlan && <BusinessPlanInfo infoClient={infoClient} />}
                        {styleRisksManagement && <RisksManagements infoClient={infoClient} />}
                        {styleCustomerStory && <ComponentCustomerStory infoClient={infoClient} />}
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTabSeleted,
        consultModulesAccess
    }, dispatch);
}

function mapStateToProps({ tabReducer, navBar }, ownerProps) {
    return {
        tabReducer,
        navBar
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabClientInfo);
