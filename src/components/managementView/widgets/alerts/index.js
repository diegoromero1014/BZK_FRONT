import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import TabComponent from "../../../../ui/Tab";
import AlertPortfolioExpiration from './alertPortfolioExpiration';
import BlackListAlerts from './blackListAlerts';
import CovenantsAlertsComponent from './covenantsAlerts';
import OutdatedContactsComponent from './outdatedContacts';

import {
    PORTFOLIO_EXPIRATION_TAB,
    COVENANTS_TAB,
    CONTROL_LISTS_TAB,
    OUTDATED_CONTACTS
} from "./constants";

import { getAlertPortfolioExpirationDashboard } from '../../../alertPortfolioExpirtation/actions';
import { getOutdatedContacts } from './actions';
import { blackListAlerts } from '../../../alertBlackList/actions';
import { covenantsAlerts } from '../../../alertCovenants/actions';
import { MAX_ROWS } from './constants';
import { NAME_FILTER_CLIENTS, NAME_FILTER_RELATION } from "../searchClient/constants";

export class AlertSection extends Component {
   
    async componentDidUpdate(prevProps) {
        if (prevProps.idFilter !== this.props.idFilter) {
            await this.firstCharge();
        }
    }

    async componentDidMount() {
        await this.firstCharge();
    }

    firstCharge = async () => {
        const { idFilter, filterType } = this.props;
        const filterClient = filterType == NAME_FILTER_CLIENTS ? idFilter : null;
        const filterEconomicGroup = filterType == NAME_FILTER_RELATION ? idFilter : null;
        await Promise.all([
            this.handleDispatchCovenantsAlerts(filterClient, filterEconomicGroup),
            this.handleDispatchBlackList(filterClient, filterEconomicGroup),
            this.handleDispatchGetAlertPortfolioExpirationDashboard(filterClient, filterEconomicGroup),
            this.handleDispatchGetOutdatedContacts(filterClient, filterEconomicGroup)
        ]);
    }

    handleDispatchBlackList = async (filterClient, filterEconomicGroup) => {
        const { dispatchBlackListAlerts } = this.props;
        return await dispatchBlackListAlerts(0, MAX_ROWS, filterClient, filterEconomicGroup);
    }

    handleDispatchCovenantsAlerts = async () => {
        const { dispatchCovenantsAlerts } = this.props;
        return await dispatchCovenantsAlerts(1, MAX_ROWS);
    }

    handleDispatchGetAlertPortfolioExpirationDashboard = async (filterClient, filterEconomicGroup) => {
        const { dispatchGetAlertPortfolioExpirationDashboard } = this.props;
        return await dispatchGetAlertPortfolioExpirationDashboard(1, filterClient, filterEconomicGroup);
    }

    handleDispatchGetOutdatedContacts = async (filterClient, filterEconomicGroup) => {
        const { dispatchGetOutdatedContacts } = this.props;
        return await dispatchGetOutdatedContacts(0, MAX_ROWS, filterClient, filterEconomicGroup);
    }

    countAlerts = (total) => {
        const { totalBlackList, totalOutdatedContacts, totalCovenant, idFilter, filterType } = this.props;
        const filterClient = filterType == NAME_FILTER_CLIENTS ? idFilter : null;
        const filterEconomicGroup = filterType == NAME_FILTER_RELATION ? idFilter : null;

        const tabs = [
            {
                name: PORTFOLIO_EXPIRATION_TAB,
                content: (
                    <div>
                        <AlertPortfolioExpiration total={total} />
                    </div>
                ),
                number: total || 0,
                callback: () => this.handleDispatchGetAlertPortfolioExpirationDashboard(filterClient, filterEconomicGroup)
            },
            {
                name: COVENANTS_TAB,
                content: <CovenantsAlertsComponent />,
                disable: false,
                number: totalCovenant || 0,
                callback: () => this.handleDispatchCovenantsAlerts(filterClient, filterEconomicGroup)
            },
            {
                name: OUTDATED_CONTACTS,
                content: <OutdatedContactsComponent />,
                disable: false,
                number: totalOutdatedContacts || 0,
                callback: () => this.handleDispatchGetOutdatedContacts(filterClient, filterEconomicGroup)
            },
            {
                name: CONTROL_LISTS_TAB,
                content: <BlackListAlerts />,
                disable: false,
                number: totalBlackList || 0,
                callback: () => this.handleDispatchBlackList(filterClient, filterEconomicGroup)
            }
        ];
        return (
            <div>
                <h3>ALERTAS</h3>
                <div style={{
                    position: 'relative',
                    background: '#FFFFFF',
                    boxShadow: '0px 1px 2px 0 rgba(34, 36, 38, 0.15)',
                    margin: '1rem 0em',
                    padding: '0px !important',
                    borderRadius: '0.28571429rem',
                    border: '1px solid rgba(34, 36, 38, 0.15)'
                }}>
                    <TabComponent tabs={tabs} />
                </div>

            </div >
        );
    }

    render() {
        const { alertPortfolioExpiration } = this.props;
        return this.countAlerts(alertPortfolioExpiration.get('totalClientsByFiltered'));
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchGetAlertPortfolioExpirationDashboard: getAlertPortfolioExpirationDashboard,
        dispatchBlackListAlerts: blackListAlerts,
        dispatchGetOutdatedContacts: getOutdatedContacts,
        dispatchCovenantsAlerts: covenantsAlerts
    }, dispatch)
};

const mapStateToProps = ({ alertPortfolioExpiration, alertBlackList, alertCovenant, outdatedContacts, filterDashboard }) => ({
    alertPortfolioExpiration,
    totalBlackList: alertBlackList.get('totalBlackListFiltered'),
    totalCovenant: alertCovenant.get('totalCovenantsByFiltered'),
    totalOutdatedContacts: outdatedContacts.rowCount,
    idFilter: filterDashboard.id,
    filterType: filterDashboard.criterio
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertSection);

