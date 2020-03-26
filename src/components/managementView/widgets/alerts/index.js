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
    const { 
      dispatchGetAlertPortfolioExpirationDashboard, 
      dispatchBlackListAlerts,
      dispatchGetOutdatedContacts, 
      dispatchCovenantsAlerts 
    } = this.props;
    
    await Promise.all([
      dispatchCovenantsAlerts(1, MAX_ROWS),
      dispatchBlackListAlerts(0, MAX_ROWS), 
      dispatchGetAlertPortfolioExpirationDashboard(1), 
      dispatchGetOutdatedContacts(0, MAX_ROWS)
    ]);
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
        number: total || 0
      },
      {
        name: COVENANTS_TAB,
        content: <CovenantsAlertsComponent />,
        disable: false,
        number: totalCovenant || 0
      },
      {
        name: OUTDATED_CONTACTS,
        content: <OutdatedContactsComponent />,
        disable: false,
        number: totalOutdatedContacts || 0
      },
      {
        name: CONTROL_LISTS_TAB,
        content: <BlackListAlerts />,
        disable: false,
        number: totalBlackList || 0
      }
    ];
    return (
      <div class="ui segment">
        <h3>ALERTAS</h3>
        <Segment>
          <TabComponent tabs={tabs} />
        </Segment>
      </div>
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

