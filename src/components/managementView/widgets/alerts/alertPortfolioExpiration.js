import React, { Component } from "react";
import { connect } from "react-redux";
import Table from "../../../table";
import { COLUMNS_VENCIMIENTO_CARTERA } from './constants';
import TableBuilder from "../../../table/TableBuilder";
import { get } from 'lodash';

class alertPortfolioExpiration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalRecords : 0
        }
      }

  async componentWillMount() {
    const { dispatchGetAlertPortfolioExpirationDashboard } = this.props;
    const response = await dispatchGetAlertPortfolioExpirationDashboard(1);
    await this.setState({
      totalRecords: get(response, "payload.data.data.pagination.rowCount")
    });
  }

  render() {
    const { alertPortfolioExpiration } = this.props;
    const { totalRecords } = this.state;
    const data = alertPortfolioExpiration.get("responseClients");
    const tableSettings = new TableBuilder(data, COLUMNS_VENCIMIENTO_CARTERA)
      .setNoRowMessage("Aun no se han creado registros ")
      .setRecordsPerPage(5)
      .setTotalRecords(totalRecords || 0)
      .setOnPageChange( async (page) => { await dispatchGetAlertPortfolioExpirationDashboard(page); debugger; })
      .build();

    return (
      <div>
        <Table tableSettings={tableSettings} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
        dispatchAlerts: clientsPendingUpdateFindServerAlerts,
      dispatchGetAlertPortfolioExpirationDashboard: getAlertPortfolioExpirationDashboard
    },
    dispatch
  );
}

function mapStateToProps({ alertPortfolioExpiration }) {
  return {
    alertPortfolioExpiration,
    totalRecords: alertPortfolioExpiration.get("totalClientsByFiltered")
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(alertPortfolioExpiration);
