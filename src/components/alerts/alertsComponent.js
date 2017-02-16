/**
 * Created by user- on 11/22/2016.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../globalComponents/actions';
import ItemAlert from './itemAlert';
import { updateTitleNavBar } from '../navBar/actions';
import { showLoading } from '../loading/actions';
import { getAlertsByUser, openModalAlerts, clearListAlerts } from './actions';
import { clearFilter as clearFilterPUC } from '../alertPendingUpdateClient/actions';
import { clearFilter as clearFilterPE } from '../alertPortfolioExpirtation/actions';
import { defaultValues } from '../alertCovenants/actions';
import { updateNumberTotalClients } from '../alertPendingUpdateClient/actions';
import { CODE_ALERT_PENDING_UPDATE_CLIENT, CODE_ALERT_PORTFOLIO_EXPIRATION, CODE_COVENANT_ALERT } from './constants';
import * as constants from '../selectsComponent/constants';
import { validatePermissionsByModule } from '../../actionsGlobal';
import { MODULE_ALERTS, MODULE_CLIENTS, BLUE_COLOR } from '../../constantsGlobal';
import { COLOR_ITEMS_MENU } from '../menu/constants';
import PortfolioExpirationIcon from '../Icons/PortfolioExpiration';
import { consultList } from '../selectsComponent/actions';
import { FORM_FILTER_ALERT_PUC } from '../alertPendingUpdateClient/constants';
import { FORM_FILTER_ALERT_PE } from '../alertPortfolioExpirtation/constants';
import { FORM_FILTER_ALERT_COVENANT } from '../alertCovenants/constants';
import _ from 'lodash';
import {Icon} from 'semantic-ui-react';

class ViewAlerts extends Component {
    constructor(props) {
        super(props);
        this.handlePaintAlerts = this.handlePaintAlerts.bind(this);
        this._cleanFilterClientPendingUpdate = this._cleanFilterClientPendingUpdate.bind(this);
        this._cleanFilterPortfolioExpiration = this._cleanFilterPortfolioExpiration.bind(this);
        this._cleanFilterAlertCovenant = this._cleanFilterAlertCovenant.bind(this);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionToken') === "") {
            redirectUrl("/login");
        }
        const {updateTitleNavBar, validatePermissionsByModule, showLoading, getAlertsByUser} = this.props;
        updateTitleNavBar("Alertas");
        showLoading(true, 'Cargando alertas..');
        getAlertsByUser().then((data) => {
            if (_.has(data, 'payload.data')) {
                showLoading(false, null);
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
    }

    _cleanFilterClientPendingUpdate() {
        const {showLoading, clearFilterPUC, consultList} = this.props;
        showLoading(true, 'Cargando..');
        clearFilterPUC();
        consultList(constants.TEAM_FOR_EMPLOYEE).then((data) => {
            if (_.has(data, 'payload.data.teamValueObjects')) {
                showLoading(false, null);
            }
        });
    }
    _cleanFilterPortfolioExpiration() {
        const {showLoading, clearFilterPE, consultList} = this.props;
        showLoading(true, 'Cargando..');
        clearFilterPE();
        consultList(constants.TEAM_FOR_EMPLOYEE).then((data) => {
            if (_.has(data, 'payload.data.teamValueObjects')) {
                showLoading(false, null);
            }
        });
    }
    _cleanFilterAlertCovenant() {
        this.props.defaultValues();
    }

    paintItemAlert(item, idx, icon, textSize, colorCard, urlAlert, fnClearFilter, nameForm) {
        return (<ItemAlert
            key={idx}
            textValue={item.nameAlert}
            fontSize={textSize}
            icon={icon}
            number={item.countClientByAlert}
            styleColor={colorCard}
            urlAlert={urlAlert}
            fnClearFilter={fnClearFilter}
            nameForm={nameForm}
            />);
    }

    handlePaintAlerts(alerts) {
        let countAlerts = 0;
        let listAlerts = alerts.map((item, idx) => {
            if (item.active) {
                switch (item.codeAlert) {
                    case CODE_ALERT_PENDING_UPDATE_CLIENT:
                        countAlerts = countAlerts + 1;
                        const iconClientsPending = <i className='users icon' style={{ fontSize: "50px", marginTop: '50px', marginLeft: "18px" }} />;
                        return this.paintItemAlert(item, idx, iconClientsPending, "15px", BLUE_COLOR,
                            "/dashboard/alertClientPendingUpdate", this._cleanFilterClientPendingUpdate, FORM_FILTER_ALERT_PUC);
                        break;
                    case CODE_ALERT_PORTFOLIO_EXPIRATION:
                        countAlerts = countAlerts + 1;
                        const iconPortfolioExp = <PortfolioExpirationIcon />;
                        return this.paintItemAlert(item, idx, iconPortfolioExp, "15px", BLUE_COLOR,
                            "/dashboard/alertClientsPortfolioExpiration", this._cleanFilterPortfolioExpiration, FORM_FILTER_ALERT_PE);
                        break;
                    case CODE_COVENANT_ALERT:
                        countAlerts = countAlerts + 1;
                        const iconCovenant = <Icon style={{fontSize: "50px", marginTop: '55px', marginLeft: "18px"}} name="briefcase"/>;
                        return this.paintItemAlert(item, idx, iconCovenant, "15px", BLUE_COLOR,
                            "/dashboard/alertCovenants", this._cleanFilterAlertCovenant, FORM_FILTER_ALERT_COVENANT);
                        break;
                    default:
                        return null;
                }
            }
        });
        if (_.isEqual(countAlerts, 0)) {
            listAlerts =
                <Col xs={12} md={12} lg={12}>
                    <h2>
                        Señor usuario, no tiene alertas pendientes.
                    </h2>
                </Col>;
        }
        return listAlerts;
    }

    render() {
        const {alerts, navBar} = this.props;
        const listAlerts = alerts.get('listAlertByUser');
        const modalIsOpen = alerts.get('openModal');

        if (_.get(navBar.get('mapModulesAccess'), MODULE_ALERTS)) {
            return (
                <div className="ui segment" style={{ marginTop: '-2px' }}>
                    <div style={{ backgroundColor: "white" }}>
                        <Row xs={12} md={12} lg={12} style={{ padding: '15px 20px 10px 20px' }}>
                            {this.handlePaintAlerts(listAlerts)}
                        </Row>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar,
        openModalAlerts,
        getAlertsByUser,
        showLoading,
        updateNumberTotalClients,
        validatePermissionsByModule,
        clearListAlerts,
        clearFilterPUC,
        clearFilterPE,
        defaultValues,
        consultList,
        updateTitleNavBar
    }, dispatch);
}

function mapStateToProps({viewManagementReducer, navBar, reducerGlobal, alerts}, ownerProps) {
    return {
        viewManagementReducer,
        navBar,
        reducerGlobal,
        alerts
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAlerts);
