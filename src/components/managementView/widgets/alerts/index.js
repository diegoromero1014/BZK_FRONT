import React, { Component } from "react";
import { Segment } from 'semantic-ui-react'
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
import { getOutdatedContacts } from '../../actions';
import { blackListAlerts } from '../../../alertBlackList/actions';
import { covenantsAlerts } from '../../../alertCovenants/actions';
import { MAX_ROWS } from './constants';

export class AlertSection extends Component {

    async componentDidMount() {
        await Promise.all([
            this.handleDispatchCovenantsAlerts(),
            this.handleDispatchBlackList(),
            this.handleDispatchGetAlertPortfolioExpirationDashboard(),
            this.handleDispatchGetOutdatedContacts()
        ]);
    }


    handleDispatchBlackList = async () => {
        const { dispatchBlackListAlerts } = this.props;
        return await dispatchBlackListAlerts(0, MAX_ROWS);
    }

    handleDispatchCovenantsAlerts = async () => {
        const { dispatchCovenantsAlerts } = this.props;
        return await dispatchCovenantsAlerts(1, MAX_ROWS);
    }

    handleDispatchGetAlertPortfolioExpirationDashboard = async () => {
        const { dispatchGetAlertPortfolioExpirationDashboard } = this.props;
        return await dispatchGetAlertPortfolioExpirationDashboard(1);
    }

    handleDispatchGetOutdatedContacts = async () => {
        const { dispatchGetOutdatedContacts } = this.props;
        return await dispatchGetOutdatedContacts(0, MAX_ROWS);
    }

    countAlerts = (total) => {
        const { totalBlackList, totalOutdatedContacts, totalCovenant } = this.props;

        const tabs = [
            {
                name: PORTFOLIO_EXPIRATION_TAB,
                content: (
                    <div>
                        <AlertPortfolioExpiration total={total} />
                    </div>
                ),
                number: total || 0,
                callback: this.handleDispatchGetAlertPortfolioExpirationDashboard
            },
            {
                name: COVENANTS_TAB,
                content: <CovenantsAlertsComponent />,
                disable: false,
                number: totalCovenant || 0,
                callback: this.handleDispatchCovenantsAlerts
            },
            {
                name: OUTDATED_CONTACTS,
                content: <OutdatedContactsComponent />,
                disable: false,
                number: totalOutdatedContacts || 0,
                callback: this.handleDispatchGetOutdatedContacts
            },
            {
                name: CONTROL_LISTS_TAB,
                content: <BlackListAlerts />,
                disable: false,
                number: totalBlackList || 0,
                callback: this.handleDispatchBlackList
            }
        ];
        return (
            <div class="ui segment alert-content" style={{ padding: '0px !important' }}>
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

const mapStateToProps = ({ alertPortfolioExpiration, alertBlackList, alertCovenant, outdatedContacts }) => ({
    alertPortfolioExpiration,
    totalBlackList: alertBlackList.get('totalBlackListFiltered'),
    totalCovenant: alertCovenant.get('totalCovenantsByFiltered'),
    totalOutdatedContacts: outdatedContacts.rowCount
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertSection);

