import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TabComponent from "../../../../ui/Tab";
import alertPortfolioExpiration from './alertPortfolioExpiration';
import {
  PORTFOLIO_EXPIRATION_TAB,
  COVENANTS_TAB,
  DEACTIVATED_CONTACTS_TABS,
  CONTROL_LISTS_TAB
} from "./constants";

import {
  clientsPendingUpdateFindServerAlerts
} from "../../../alertPortfolioExpirtation/actions";

export class AlertSection extends Component {
  constructor(props) {
    super(props);
    this.countAlerts = this.countAlerts.bind(this);
  }

  countAlerts() {
    const tabs = [
      {
        name: PORTFOLIO_EXPIRATION_TAB,
        content: (
          <div>
            <alertPortfolioExpiration /> 
          </div>
        ),
        number: totalRecords
      },
      {
        name: COVENANTS_TAB,
        content: <div>Tab 3 Content</div>,
        disable: false
      },
      {
        name: DEACTIVATED_CONTACTS_TABS,
        content: <div>Tab 3 Content</div>,
        disable: false
      },
      {
        name: CONTROL_LISTS_TAB,
        content: <div>Tab 4 Content</div>,
        disable: true
      }
    ];
    return (
      <div>
        <TabComponent tabs={tabs} />
      </div>
    );
  }

  render() {
    return this.countAlerts();
  }
}

function mapDispatchToProps(dispatch) {  
  return bindActionCreators({
    dispatchAlerts: clientsPendingUpdateFindServerAlerts,
  }, dispatch);
}

const mapStateToProps = () => {}

export default connect(mapStateToProps, mapDispatchToProps)(AlertSection);

