import React, { Component } from "react";
import { connect } from "react-redux";
import Table from "../../../table";
import { COLUMNS_VENCIMIENTO_CARTERA } from './constants';
import TableBuilder from "../../../table/TableBuilder";
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { getAlertPortfolioExpirationDashboard } from '../../../alertPortfolioExpirtation/actions';

class AlertPortfolioExpiration extends Component {

  componentDidMount() {
    this.forceUpdate();
  }
  

  render() {
    const { alertPortfolioExpiration, dispatchGetAlertPortfolioExpirationDashboard, total } = this.props;
    const data = alertPortfolioExpiration.get("responseClients");
    const tableSettings = new TableBuilder(data, COLUMNS_VENCIMIENTO_CARTERA)
      .setNoRowMessage("Aun no se han creado registros ")
      .setRecordsPerPage(5)
      .setTotalRecords(total)
      .setOnPageChange(async page => await dispatchGetAlertPortfolioExpirationDashboard(page))
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
)(AlertPortfolioExpiration);
