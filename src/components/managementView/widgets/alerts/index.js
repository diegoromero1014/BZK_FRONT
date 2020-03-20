import React, { Component } from "react";
import { Segment } from 'semantic-ui-react'
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
import { MAX_ROWS } from './constants';

export class AlertSection extends Component {

  async componentDidMount() {
    const { dispatchGetAlertPortfolioExpirationDashboard, dispatchBlackListAlerts } = this.props;

    await Promise.all([dispatchBlackListAlerts(0, MAX_ROWS), dispatchGetAlertPortfolioExpirationDashboard(1)]);
  }

  countAlerts = (total) => {
    const { totalBlackList } = this.props;

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
        disable: false,
        number: totalBlackList || 0
      }
    ];
    return (
      <div class="ui attached segment">
        <h3>ALERTAS</h3>
        <Segment attached>
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
    dispatchBlackListAlerts: blackListAlerts
  }, dispatch)
};

const mapStateToProps = ({ alertPortfolioExpiration, alertBlackList }) => ({
  alertPortfolioExpiration,
  totalBlackList: alertBlackList.get('totalBlackListFiltered')
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertSection);

