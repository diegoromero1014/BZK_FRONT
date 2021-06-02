import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Label } from "semantic-ui-react";
import { get } from "lodash";

import DetailsInfoClient from "../clientDetailsInfo/detailsInfoClient";
import ContactInfo from "../contact/component";
import Partners from "../clients/partners/tabComponent";
import PrevisitaInfo from "../previsita/component";
import VisitaInfo from "../visit/component";
import PipelineInfo from "../pipeline/component";
import BusinessPlanInfo from "../businessPlan/component";
import ClientTaskList from "../pendingTask/ClientTaskList";
import RisksManagements from "../risksManagement/componentRisksManagement";
import ComponentCustomerStory from "../customerStory/componentCustomerStory";
import ToolTip from "./../toolTip/toolTipComponent";
import EmbebedVisorComponent from "../clientVisor/embebedVisorComponent";

import { updateTabSeleted } from "../clientDetailsInfo/actions";
import { pendingTasksByClientPromise } from "./../pendingTask/actions";
import {
  MODULE_CONTACTS,
  MODULE_PREVISITS,
  MODULE_VISITS,
  MODULE_TASKS,
  MODULE_PIPELINE,
  MODULE_BUSSINESS_PLAN,
  MODULE_RISKS_MANAGEMENT,
  MODULE_CUSTOMER_STORY,
  MODULE_PARTNERS,
  MODULE_CLIENTS,
} from "../../constantsGlobal";
import {
  TAB_INFO,
  TAB_CONTACTS,
  TAB_SHAREHOLDER,
  TAB_PREVISITS,
  TAB_VISITS,
  TAB_PENDING_TASK,
  TAB_PIPELINE,
  TAB_BUSINESS_PLAN,
  TAB_RISKS_MANAGEMENT,
  TAB_CUSTOMER_STORY,
  TAB_360_VISION,
} from "../../constantsGlobal";
import {
  BIZTRACK_MY_CLIENTS,
  _PIPELINE,
  nombreflujoAnalytics,
  _BUSINESS_PLAN,
  _RISKS_MANAGEMENT,
} from "../../constantsAnalytics";
import { NUMBER_RECORDS } from "../pendingTask/constants";
import { TOOLTIP_PENDING_TASK } from "./constants";

import {
  executeFunctionIfInternetExplorer,
  showSweetAlertErrorMessage,
} from "../../utils/browserValidation";
import { swtShowMessage } from "../sweetAlertMessages/actions";
import { changeStatusMenuAct, changeStatusMenuDes } from "../main/actions";

export class TabClientInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabActive: 1,
      counterTabPending: 0,
    };
  }

  activeHideInf(tabSelect) {
    const { activeHideInfo, activeShowIndo } = this.props;
    if (tabSelect === TAB_360_VISION) {
      activeHideInfo();
      this.changesStatusMenuAct();
    } else {
      this.changesStatusMenuDes();
      activeShowIndo();
    }
  }

  handleClickTabItem = (tabSelect) => {
    const { disptachUpdateTabSeleted } = this.props;
    disptachUpdateTabSeleted(tabSelect);
    this.activeHideInf(tabSelect);
    this.setState({
      tabActive: tabSelect,
    });
  };

  handleChangeCounterTabPending = (counter) => {
    this.setState({
      counterTabPending: counter,
    });
  };

  componentWillUnmount() {
    this.setState({
      tabActive: 1,
    });
  }

  componentDidMount() {
    pendingTasksByClientPromise(
      0,
      window.sessionStorage.getItem("idClientSelected"),
      NUMBER_RECORDS,
      1,
      null
    ).then((result) => {
      if (200 === result.data.status) {
        const data = result.data.data;
        this.setState({ counterTabPending: data.rowCount });
      }
    });
  }
  changesStatusMenuAct = () => {
    const { dispatchDesactiveMenu } = this.props;
    dispatchDesactiveMenu();
  };
  changesStatusMenuDes = () => {
    const { dispatchChangeActiveMenu } = this.props;
    dispatchChangeActiveMenu();
  };

  render() {
    const {
      infoClient,
      tabReducer,
      navBar,
      swtShowMessage,
      allow_visor,
      mainReducer,
    } = this.props;
    const tabStyleInactive = {
      height: "60px",
      borderBottomStyle: "none",
      width: "70px",
    };
    const tabStyleActive = {
      height: "60px",
      borderBottomStyle: "solid",
      borderBottomColor: "#3498db",
      width: "70px",
    };

    const bigTabStyleInactive = {
      height: "60px",
      borderBottomStyle: "none",
      width: "140px",
    };
    const bigTabStyleActive = {
      height: "60px",
      borderBottomStyle: "solid",
      borderBottomColor: "#3498db",
      width: "140px",
    };

    var tabActive = tabReducer.get("tabSelected");

    if (tabActive === null || tabActive === undefined || tabActive === "") {
      tabActive = TAB_INFO;
    }

    if (tabActive === TAB_PIPELINE) {
      window.dataLayer.push({
        nombreflujo: nombreflujoAnalytics,
        event: BIZTRACK_MY_CLIENTS + _PIPELINE,
        pagina: _PIPELINE,
      });
    }

    if (tabActive === TAB_BUSINESS_PLAN) {
      window.dataLayer.push({
        nombreflujo: nombreflujoAnalytics,
        event: BIZTRACK_MY_CLIENTS + _BUSINESS_PLAN,
        pagina: _BUSINESS_PLAN,
      });
    }

    if (tabActive === TAB_RISKS_MANAGEMENT) {
      window.dataLayer.push({
        nombreflujo: nombreflujoAnalytics,
        event: BIZTRACK_MY_CLIENTS + _RISKS_MANAGEMENT,
        pagina: _RISKS_MANAGEMENT,
      });
    }

    return (
      <div>
        <div className="my-custom-tab" style={{ marginTop: "2px" }}>
          <ul
            className="nav nav-tabs custom-tab"
            style={{
              backgroundColor: "white",
              height: "60px",
              boxShadow: "0px 1px 0px 0 rgba(0, 0, 0, 0.2)",
              marginTop: "0px",
            }}
          >
            <li
              style={tabActive === TAB_INFO ? tabStyleActive : tabStyleInactive}
              id="infoTab"
              onClick={this.handleClickTabItem.bind(this, TAB_INFO)}
            >
              <a className="button-link-url" style={{ marginRight: "15px" }}>
                Info
              </a>
            </li>
            {get(navBar.get("mapModulesAccess"), MODULE_CONTACTS) && (
              <li
                style={
                  tabActive === TAB_CONTACTS ? tabStyleActive : tabStyleInactive
                }
                onClick={this.handleClickTabItem.bind(this, TAB_CONTACTS)}
              >
                <a className="button-link-url" style={{ marginRight: "15px" }}>
                  Contactos
                </a>
              </li>
            )}
            {get(navBar.get("mapModulesAccess"), MODULE_PARTNERS) && (
              <li
                style={
                  tabActive === TAB_SHAREHOLDER
                    ? tabStyleActive
                    : tabStyleInactive
                }
                onClick={this.handleClickTabItem.bind(this, TAB_SHAREHOLDER)}
              >
                <a className="button-link-url" style={{ marginRight: "15px" }}>
                  Accionistas/Junta
                </a>
              </li>
            )}
            {get(navBar.get("mapModulesAccess"), MODULE_CUSTOMER_STORY) && (
              <li
                style={
                  tabActive === TAB_CUSTOMER_STORY
                    ? bigTabStyleActive
                    : bigTabStyleInactive
                }
                onClick={this.handleClickTabItem.bind(this, TAB_CUSTOMER_STORY)}
              >
                <a className="button-link-url" style={{ marginRight: "15px" }}>
                  Historial del cliente
                </a>
              </li>
            )}
            {get(navBar.get("mapModulesAccess"), MODULE_BUSSINESS_PLAN) && (
              <li
                style={
                  tabActive === TAB_BUSINESS_PLAN
                    ? bigTabStyleActive
                    : bigTabStyleInactive
                }
                onClick={this.handleClickTabItem.bind(this, TAB_BUSINESS_PLAN)}
              >
                <a className="button-link-url" style={{ marginRight: "15px" }}>
                  Plan de negocio
                </a>
              </li>
            )}
            {get(navBar.get("mapModulesAccess"), MODULE_PREVISITS) && (
              <li
                style={
                  tabActive === TAB_PREVISITS
                    ? tabStyleActive
                    : tabStyleInactive
                }
                onClick={this.handleClickTabItem.bind(this, TAB_PREVISITS)}
              >
                <a className="button-link-url" style={{ marginRight: "15px" }}>
                  Previsitas
                </a>
              </li>
            )}
            {get(navBar.get("mapModulesAccess"), MODULE_VISITS) && (
              <li
                style={
                  tabActive === TAB_VISITS ? tabStyleActive : tabStyleInactive
                }
                onClick={this.handleClickTabItem.bind(this, TAB_VISITS)}
              >
                <a className="button-link-url" style={{ marginRight: "15px" }}>
                  Visitas/Reunión
                </a>
              </li>
            )}
            {get(navBar.get("mapModulesAccess"), MODULE_PIPELINE) && (
              <li
                style={
                  tabActive === TAB_PIPELINE ? tabStyleActive : tabStyleInactive
                }
                onClick={this.handleClickTabItem.bind(this, TAB_PIPELINE)}
              >
                <a className="button-link-url" style={{ marginRight: "15px" }}>
                  Pipeline
                </a>
              </li>
            )}
            {get(navBar.get("mapModulesAccess"), MODULE_TASKS) && (
              <li
                style={
                  tabActive === TAB_PENDING_TASK
                    ? tabStyleActive
                    : tabStyleInactive
                }
                onClick={this.handleClickTabItem.bind(this, TAB_PENDING_TASK)}
              >
                {this.state.counterTabPending > 0 && (
                  <ToolTip
                    text={TOOLTIP_PENDING_TASK(this.state.counterTabPending)}
                  >
                    <Label
                      circular
                      floating
                      color={"blue"}
                      key={"counter"}
                      content={
                        this.state.counterTabPending > 99
                          ? "99+"
                          : this.state.counterTabPending
                      }
                      className="notificationTabTask"
                      size={"tiny"}
                    />
                  </ToolTip>
                )}
                <a className="button-link-url" style={{ marginLeft: "-20px" }}>
                  Tareas
                </a>
              </li>
            )}
            {get(navBar.get("mapModulesAccess"), MODULE_RISKS_MANAGEMENT) && (
              <li
                style={
                  tabActive === TAB_RISKS_MANAGEMENT
                    ? bigTabStyleActive
                    : bigTabStyleInactive
                }
                onClick={this.handleClickTabItem.bind(
                  this,
                  TAB_RISKS_MANAGEMENT
                )}
              >
                <a className="button-link-url" style={{ marginRight: "15px" }}>
                  Gestión de riesgos
                </a>
              </li>
            )}
            {allow_visor && (
              <li
              id="tabVista"
                className={".tab-section-360"}
                style={
                  tabActive === TAB_360_VISION
                    ? bigTabStyleActive
                    : bigTabStyleInactive
                }
                onClick={() => executeFunctionIfInternetExplorer(this.handleClickTabItem.bind(this, TAB_360_VISION), showSweetAlertErrorMessage(swtShowMessage))}
              >
                <a className="button-link-url" style={{ marginRight: "15px" }}>
                  Visión 360°
                </a>
              </li>
            )}
          </ul>
          <div
            className="header-client-detail"
            style={{
              paddingLeft: "20px",
              height: "84%",
              paddingRight: "20px",
              backgroundColor: "white",
              marginTop: "-8px",
            }}
          >
            {tabActive === TAB_INFO && (
              <DetailsInfoClient infoClient={infoClient} />
            )}
            {tabActive === TAB_CONTACTS && (
              <ContactInfo infoClient={infoClient} />
            )}
            {tabActive === TAB_SHAREHOLDER && (
              <Partners infoClient={infoClient} />
            )}
            {tabActive === TAB_PREVISITS && (
              <PrevisitaInfo infoClient={infoClient} />
            )}
            {tabActive === TAB_VISITS && <VisitaInfo infoClient={infoClient} />}
            {tabActive === TAB_PENDING_TASK && (
              <ClientTaskList
                infoClient={infoClient}
                updateCounterPending={(counter) =>
                  this.handleChangeCounterTabPending(counter)
                }
              />
            )}
            {tabActive === TAB_PIPELINE && (
              <PipelineInfo infoClient={infoClient} />
            )}
            {tabActive === TAB_BUSINESS_PLAN && (
              <BusinessPlanInfo infoClient={infoClient} />
            )}
            {tabActive === TAB_RISKS_MANAGEMENT && (
              <RisksManagements infoClient={infoClient} />
            )}
            {tabActive === TAB_CUSTOMER_STORY && (
              <ComponentCustomerStory infoClient={infoClient} />
            )}
            {tabActive === TAB_360_VISION && (
              <EmbebedVisorComponent infoClient={infoClient} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      swtShowMessage,
      disptachUpdateTabSeleted: updateTabSeleted,
      dispatchChangeActiveMenu: changeStatusMenuAct,
      dispatchDesactiveMenu: changeStatusMenuDes,
    },
    dispatch
  );
}

const mapStateToProps = ({ tabReducer, navBar, mainReducer }) => {
  return {
    tabReducer,
    navBar,
    mainReducer,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabClientInfo);
