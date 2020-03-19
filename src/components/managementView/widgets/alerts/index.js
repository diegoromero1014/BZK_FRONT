import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TabComponent from "../../../../ui/Tab";
import AlertPortfolioExpiration from './alertPortfolioExpiration';
import BlackListAlerts from './blackListAlerts';

import {
  PORTFOLIO_EXPIRATION_TAB,
  COVENANTS_TAB,
  DEACTIVATED_CONTACTS_TABS,
  CONTROL_LISTS_TAB
} from "./constants";

import { getAlertPortfolioExpirationDashboard } from '../../../alertPortfolioExpirtation/actions';
import { blackListAlerts } from '../../../alertBlackList/actions';

export class AlertSection extends Component {

  async componentDidMount() {
    const { dispatchGetAlertPortfolioExpirationDashboard, dispatchBlackListAlerts } = this.props;

    await Promise.all(dispatchBlackListAlerts(0, 5), dispatchGetAlertPortfolioExpirationDashboard(1));
  }

  countAlerts = (total) => {
    const tabs = [
      {
        name: PORTFOLIO_EXPIRATION_TAB,
        content: (
          <div>
            <AlertPortfolioExpiration total={total} />
          </div>
        ),
        number: total
      },
      {
        name: COVENANTS_TAB,
        content: <div>Tab 3 Content</div>,
        disable: true
      },
      {
        name: DEACTIVATED_CONTACTS_TABS,
        content: <div>Tab 3 Content</div>,
        disable: true
      },
      {
        name: CONTROL_LISTS_TAB,
        content: <BlackListAlerts />,
        disable: false
      }
    ];
    return (
      <div>
        <h3>ALERTAS</h3>
        <TabComponent tabs={tabs} />
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
    dispatchBlackListAlerts: blackListAlerts
  }, dispatch)
};

const mapStateToProps = ({ alertPortfolioExpiration, alertBlackList }) => ({
  alertPortfolioExpiration,
  alertBlackList
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertSection);

