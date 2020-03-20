import React, { Component } from "react";
import { Segment } from 'semantic-ui-react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TabComponent from "../../../../ui/Tab";
import AlertPortfolioExpiration from './alertPortfolioExpiration';
import {
  PORTFOLIO_EXPIRATION_TAB,
  COVENANTS_TAB,
  CONTROL_LISTS_TAB,
  OUTDATED_CONTACTS
} from "./constants";
import { getAlertPortfolioExpirationDashboard } from '../../../alertPortfolioExpirtation/actions';

export class AlertSection extends Component {

  async componentWillMount() {
    const { dispatchGetAlertPortfolioExpirationDashboard } = this.props;

    await dispatchGetAlertPortfolioExpirationDashboard(1);
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
        name: OUTDATED_CONTACTS,
        content: <OutdatedContactsComponent />,
        disable: false
      },
      {
        name: CONTROL_LISTS_TAB,
        content: <div>Tab 4 Content</div>,
        disable: true
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

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    dispatchGetAlertPortfolioExpirationDashboard: getAlertPortfolioExpirationDashboard
  }, dispatch);
}

const mapStateToProps = ({ alertPortfolioExpiration }) => ({
  alertPortfolioExpiration
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertSection);

