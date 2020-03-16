import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TabComponent from "../../../../ui/Tab";
import {
  PORTFOLIO_EXPIRATION_TAB,
  COVENANTS_TAB,
  DEACTIVATED_CONTACTS_TABS,
  CONTROL_LISTS_TAB,
  COLUMNS_VENCIMIENTO_CARTERA
} from "./constants";
import TableComponent from '../../../table/index';
import ListClientsAlertPortfolioExp from "../../../alertPortfolioExpirtation/listPortfolioExpiration";

import {
  clientsPendingUpdateFindServerAlerts,
  clearFilter
} from "../../../alertPortfolioExpirtation/actions";
import TableBuilder from "../../../table/TableBuilder";

export class AlertSection extends Component {
  constructor(props) {
    super(props);
    this.countAlerts = this.countAlerts.bind(this);
  }

  async componentWillMount() {
    const { dispatchClearFilter } = this.props;    
    await dispatchClearFilter();
  }

  countAlerts() {
    const { alertPortfolioExpiration } = this.props;    
    const data = alertPortfolioExpiration.get('responseClients');
    const tableSettings = new TableBuilder(data, COLUMNS_VENCIMIENTO_CARTERA)
      .setNoRowMessage("Aun no se han creado registros ")
      .setRecordsPerPage(5)
      .setTotalRecords(10)
      .build()
    const numberTotalClientFiltered = alertPortfolioExpiration.get(
      "totalClientsByFiltered"
    );
    const tabs = [
      {
        name: PORTFOLIO_EXPIRATION_TAB,
        content: (
          <div>
            {/* <ListClientsAlertPortfolioExp /> */}
            <TableComponent tableSettings={tableSettings}/> 
          </div>
        ),
        number: numberTotalClientFiltered
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
    dispatchClearFilter: clearFilter
  }, dispatch);
}

function mapStateToProps({ alertPortfolioExpiration }) {
  return {
    alertPortfolioExpiration
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertSection);

